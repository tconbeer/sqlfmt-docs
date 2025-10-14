import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Heading from '@theme/Heading';
import Head from '@docusaurus/Head';

import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { sql } from '@codemirror/lang-sql';
import { aura } from '@uiw/codemirror-theme-aura';
import { noctisLilac } from '@uiw/codemirror-theme-noctis-lilac';

function useTheme() {
  const htmlElement = document.querySelector('html')
  const initialTheme = htmlElement.dataset.theme;
  const [theme, setTheme] = useState(initialTheme)
  const observerConfig = { attributes: true, childList: false, subtree: false}

  useEffect( () => {
    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === "attributes" && mutation.attributeName === "data-theme") {
          setTheme(htmlElement.dataset.theme)
        }
      }
    }

    const observer = new MutationObserver(callback)

    observer.observe(htmlElement, observerConfig)

    return () => {observer.disconnect()}
  } , [])

  return theme == "dark" ? aura : noctisLilac
}

function usePyodide() {
  const pyodideRef = useRef(null)
  const [isLoading, setLoading] = useState(true)
  
  useEffect( () => {
      const loadPyodideAndPackages = async () => {
        if (!pyodideRef.current) {
          const pyodide = await window.loadPyodide()
          await pyodide.loadPackage("micropip");
          const micropip = pyodide.pyimport("micropip");
          await micropip.install('black');
          await micropip.install('shandy-sqlfmt');

          pyodideRef.current = pyodide
        }
        setLoading(false)
      };
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.28.3/full/pyodide.js";
      script.onload = loadPyodideAndPackages;
      document.body.appendChild(script);
    }
    , []
  )
  return [pyodideRef.current, isLoading]
}

function Editor() {
  const [isRunning, setRunning] = useState(false)
  const [pyodide, isLoading] = usePyodide()
  const editorTheme = useTheme()
  const extensions = [sql()]

  const [code, setCode] = useState("select 1")
  const [lineLength, setLineLength] = useState(88)
  const [fmtJinja, setFmtJinja] = useState(true)

  const exampleQuery = `
  {%- set stage_names = dbt_utils.get_column_values(ref('prep_stages_to_include_spo'), 'stage_name', default=[]) -%}

{{ config({
    "materialized": "table"
    })
}}

{{simple_cte([
  ('dim_namespace', 'dim_namespace'),
  ('prep_gitlab_dotcom_plan', 'prep_gitlab_dotcom_plan'),
  ('dim_date', 'dim_date'),
  ('all_events', 'fct_daily_event_400'),
  ('metrics', 'map_saas_event_to_smau')
])
}}

, events AS (
  
    SELECT
      all_events.ultimate_parent_namespace_id,
      all_events.event_created_date,
      DATE_TRUNC('month', event_created_date)                             AS event_month,
      prep_gitlab_dotcom_plan.plan_name                                   AS plan_name_at_reporting_month,
      dim_user_id,
      metrics.stage_name,
      COUNT(event_created_date)                                           AS event_count,
      0 AS umau
    FROM all_events
    INNER JOIN metrics ON all_events.event_name = metrics.event_name
      AND is_smau
    LEFT JOIN prep_gitlab_dotcom_plan ON all_events.dim_plan_id_at_event_date = prep_gitlab_dotcom_plan.dim_plan_id
    WHERE namespace_is_internal = FALSE
      AND days_since_namespace_creation >= 0
    {{dbt_utils.group_by(n=6)}}
                                                                                  
), joined AS (                                               

    SELECT
      'SaaS'                                                                  AS delivery, 
      events.ultimate_parent_namespace_id                                     AS organization_id,
      namespace_type                                                          AS organization_type,
      DATE(created_at)                                                        AS organization_creation_date,
      first_day_of_month                                                      AS reporting_month,
      stage_name,
      plan_name_at_reporting_month,
      IFF(plan_name_at_reporting_month NOT IN ('free','trial'), TRUE, FALSE)  AS plan_is_paid,
      SUM(event_count)                                                        AS monthly_stage_events,
      COUNT(DISTINCT dim_user_id)                                             AS monthly_stage_users,
      COUNT(DISTINCT event_created_date)                                      AS stage_active_days,
      IFF(monthly_stage_users > 0, TRUE, FALSE)                               AS is_active_stage
    FROM events
    INNER JOIN dim_date 
      ON events.event_month = dim_date.date_day
    INNER JOIN dim_namespace 
      ON dim_namespace.dim_namespace_id = events.ultimate_parent_namespace_id
    WHERE event_created_date >= DATEADD('day',-28, dim_date.last_day_of_month)
    {{dbt_utils.group_by(n=7)}}
  
)

SELECT
  reporting_month,
  organization_id::VARCHAR             AS organization_id,
  delivery,
  organization_type,
  plan_name_at_reporting_month         AS product_tier,
  plan_is_paid                         AS is_paid_product_tier,
  --organization_creation_date,
  --created_by_blocked_user,
  SUM(IFF(is_active_stage > 0 , 1, 0)) AS active_stage_count,
  {{ dbt_utils.pivot(
  'stage_name', 
  stage_names,
  agg = 'MAX',
  then_value = 'monthly_stage_users',
  else_value = 'NULL',
  suffix='_stage',
  quote_identifiers = False
  ) }}
FROM joined
{{dbt_utils.group_by(n=6)}}
  `

  async function format() {
    setRunning(true)
    if (pyodide) {
      pyodide.globals.code = code;
      pyodide.globals.line_length = lineLength;
      pyodide.globals.no_jinjafmt = !fmtJinja;
      const formatted = await pyodide.runPythonAsync(`
        from sqlfmt.api import Mode, format_string
        mode = Mode(
          line_length=int(line_length),
          no_jinjafmt=no_jinjafmt
        )
        format_string(code, mode)
      `)
      setCode(formatted)
    }
    setRunning(false)
  }

  return (
    <>
      <CodeMirror 
        value={code}
        height="400px"
        theme={editorTheme}
        extensions={extensions}
        onChange={(value) => setCode(value)}
      />
      <div className={styles.exampleButtons}>
        <button 
          onClick={() => setCode(exampleQuery)}
          >Load unformatted example
        </button>
        <button 
          onClick={() => setCode("")}
          >Clear Editor
        </button>
      </div>
      <div className={styles.controls}>
        <div className={styles.slider}>
          <label
            for="lineLengthSlider"
            className={styles.controlLabel}
            >
            Line Length:
          </label>
          <input
            id="lineLengthSlider"
            type="range"
            min="40"
            max="140"
            step="1"
            defaultValue={lineLength}
            onChange={(event) => setLineLength(event.target.value)}
          />
          <output>{lineLength.toString()}</output>
        </div>
        <div className={styles.checkbox}>
          <label
            for="jinjaCheckbox"
            className={styles.controlLabel}
            >
            Format Jinja:
          </label>
          <input
            id="jinjaCheckbox"
            type="checkbox"
            defaultChecked={fmtJinja}
            onChange={(event) => setFmtJinja(event.target.checked)}
            />
        </div>
        <button 
          className='button button--primary' 
          onClick={format} 
          disabled={isLoading || isRunning}
          >
          { isLoading ? 'Loading...' : isRunning ? 'Formatting...' : 'sqlfmt!' }
        </button>
      </div>
    </>
  );
}


export default function HomepagePlayground() {
  return (
    <section className={styles.playground}>
      <div className="container">
        <Heading as="h2">Try it here</Heading>
        <p> Type or paste a <code>select</code> statement into the box below. Click the button to have it formatted.</p>
        <Editor />
      </div>
    </section>
  );
}

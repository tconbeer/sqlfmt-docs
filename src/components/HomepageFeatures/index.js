import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Easy to Use',
    description: (
      <>
        sqlfmt installs in seconds on any device running Python.
        No configuration necessary. Works with your dialect,
        code editor, and CI.
      </>
    ),
  },
  {
    title: 'Promotes Collaboration',
    description: (
      <>
        sqlfmt enforces a single style, making code reviews faster
        and more pleasant.
      </>
    ),
  },
  {
    title: 'Fast and Lightweight',
    description: (
      <>
        sqlfmt formats hundreds of files per second, and keeps a cache
        so incremental invocations run in the blink of an eye.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

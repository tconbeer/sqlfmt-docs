import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
export default function FooterLinkItem({item}) {
  const {to, href, label, prependBaseUrlToHref, ...props} = item;
  const toUrl = useBaseUrl(to);
  const normalizedHref = useBaseUrl(href, {forcePrependBaseUrl: true});
  // TC: swizzled this component to use a plain a tag for external links,
  // so we don't add a rel="noopener noreferrer" prop to all external
  // footer links.

  // TC: code inside the first conditional block is the original code
  if (to || isInternalUrl(href)) {
    return (
      <Link
        className="footer__link-item"
        {...(href
          ? {
              href: prependBaseUrlToHref ? normalizedHref : href,
            }
          : {
              to: toUrl,
            })}
        {...props}>
        {label}
        {href && !isInternalUrl(href) && <IconExternalLink />}
      </Link>
    );
  } else {
    return(
      <a
        className="footer__link-item"
        href={prependBaseUrlToHref ? normalizedHref : href}
        {...props}
      >
        {label}
        {href && !isInternalUrl(href) && <IconExternalLink />}
      </a>
    )
  }
}
import React from 'react';
import ContentLoader from 'react-content-loader';

const MasterLoader = (props: any) => (
  <ContentLoader
    speed={2}
    width={400}
    height={260}
    viewBox="0 0 400 260"
    backgroundColor="#d8d4d4"
    foregroundColor="#b8b7b7"
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    <rect x="2" y="18" rx="3" ry="3" width="279" height="6" />
    <rect x="2" y="38" rx="3" ry="3" width="243" height="4" />
    <rect x="313" y="19" rx="5" ry="5" width="52" height="23" />
    <rect x="2" y="88" rx="3" ry="3" width="279" height="6" />
    <rect x="2" y="108" rx="3" ry="3" width="243" height="4" />
    <rect x="313" y="89" rx="5" ry="5" width="48" height="22" />
    <rect x="2" y="158" rx="3" ry="3" width="279" height="6" />
    <rect x="2" y="178" rx="3" ry="3" width="243" height="4" />
    <rect x="313" y="159" rx="5" ry="5" width="48" height="22" />
  </ContentLoader>
);

// eslint-disable-next-line import/prefer-default-export
export { MasterLoader };

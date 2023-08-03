import React from 'react';
import Chef from '../assets/chef.svg';

export default function Noorders() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '91vh',
      }}
    >
      {/* <Chef /> */}
      <img title="No KOT found" style={{ width: '50%' }} src={Chef} alt="" />
    </div>
  );
}

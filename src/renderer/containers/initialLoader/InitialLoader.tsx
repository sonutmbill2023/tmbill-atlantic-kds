/* eslint-disable no-empty-pattern */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import routes from '../../constants/routes.json';
import './initialLoader.css';

type Props = {};
function InitialLoader({}: Props) {
  const navigate = useNavigate();

  // If the useEffect's second param is empty.
  // it means it is mounted.
  useEffect(() => {
    const checkIfuserloggedin = () => {
      // navigate(routes.SETTINGS.GENERAL);
      navigate(routes.FINDMASTER);
    };

    setTimeout(() => {
      checkIfuserloggedin();
    }, 4000);
  }, []);

  return <div className="se-pre-con" />;
}
export default InitialLoader;

import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { showNotification } from '../../components/Antnotify';
import { verifyUser } from '../../redux/actions/Master';
import { Links, setBaseurl } from '../../config/common';
import routes from '../../constants/routes.json';
import styles from './login.module.css';
import { MasterReducer } from '../../types';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Button, Layout, Tag } from 'antd';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { useHotkeys } from 'react-hotkeys-hook';

const { Header } = Layout;

type LoginstateProp = {
  masterReducer: MasterReducer;
};
type IStoreCredential = {
  username: string;
  password: string;
  ipaddress?: string;
  storeName?: string;
};

export default function Login() {
  const navigate = useNavigate();
  const { state: passedProps } = useLocation();

  const dispatch = useDispatch();
  const userDetails = useSelector(
    (state: LoginstateProp) => state.masterReducer.userDetails
  );
  const tokenExpired = useSelector(
    (state: LoginstateProp) => state.masterReducer.tokenExpired
  );

  const miscData = useSelector(
    (state: LoginstateProp) => state.masterReducer.miscData
  );
  const [userCredentials, setuserCredentials] = useLocalStorage<string>(
    'USER_CREDS',
    ''
  );
  const [storeduserCredentials] = useState<IStoreCredential | undefined>(
    userCredentials && JSON.parse(userCredentials || '')
  );

  const [username, setusername] = useState<string | undefined>(
    storeduserCredentials?.username || ''
  );
  const [password, setpassword] = useState<string | undefined>(
    storeduserCredentials?.password || ''
  );
  console.log(storeduserCredentials?.username,storeduserCredentials?.password,'from storeduser')

  const [ipaddress, setipAddress] = useState<string | undefined>(
    passedProps.ipAddress || storeduserCredentials?.ipaddress || ''
  );

  const [checkingUser, setcheckingUser] = useState(false);
  const [outlet] = useState(
    passedProps && passedProps.outlet ? passedProps.outlet : undefined
  );
  useEffect(() => {
    if (
      outlet === undefined ||
      Links.SERVER_API_URL === '' ||
      passedProps.ipAddress === undefined
    ) {
      navigate(routes.FINDMASTER);
    }

    if (userDetails && userDetails.token && !tokenExpired) {
      navigate(routes.HOME);
      return;
    }

    if (username && password) {
      login();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userDetails) {
      setcheckingUser(false);
      if (userDetails.error) {
        showNotification({ icon: 'error', message: userDetails.error });
        // userDetails.error = '';
        return;
      }
      if (
        userDetails.status === 200 &&
        miscData &&
        miscData.outlet === outlet
      ) {
        showNotification({ icon: 'success', message: 'Welcome' });
        navigate(routes.HOME);
        setuserCredentials(
          JSON.stringify({
            username,
            password,
            storeName: outlet,
            ipaddress,
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  const handleChange = (
    key: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    switch (key) {
      case 'username':
        setusername(e.target.value);
        break;
      case 'password':
        setpassword(e.target.value);
        break;
      case 'ipaddress':
        setipAddress(e.target.value);
        setBaseurl(`http://${e.target.value}:3000/`);
        break;
      default:
        break;
    }
  };

  const login = async () => {
    if (!username || !password) {
      // notifyUser('error', 'Username and password is required.');
      showNotification({
        icon: 'error',
        message: 'Username and password is required.',
      });
      return;
    }
    setBaseurl(`http://${ipaddress}:3000/`);
    setcheckingUser(true);
    dispatch(
      verifyUser({
        username,
        password,
        miscData: passedProps,
        ipaddress,
      })
    );
  };

  const goBack = () => {
    navigate(-1);
  };

  useHotkeys(['enter'], login);

  return (
    <Layout className={`${styles.loginLayout}`} title="Login">
      <Header className={`${styles.header}`}>
        <Button
          className={`mr-2 iconButtons`}
          onClick={goBack}
          title="Open Settings"
          icon={<IoArrowBackCircleOutline size={35} />}
        />
      </Header>
      <div className={styles.loginContainer}>
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 100 }}
          className={styles.logincontrolsContainer}
        >
          <div
            className={styles.outletTitle}
            title={`You are now connected to ${outlet}`}
          >
            {outlet}
            {passedProps.username && (
              <Tag color="geekblue" className="ml-2" bordered={false}>
                {passedProps.username}
              </Tag>
            )}
          </div>
          <div className="form-group">
            <input
              value={ipaddress}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChange('ipaddress', event);
              }}
              className="form-control mt-2 ipaddress-input"
              placeholder="IP Address"
              title="Master POS IP Address"
            />
            <input
              value={username}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChange('username', event);
              }}
              className="form-control mt-2"
              placeholder="Username"
              title="Please enter your KDS username"
            />
            <input
              value={password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                handleChange('password', event);
              }}
              type="password"
              className="form-control mt-2"
              placeholder="Password"
              title="Please enter your KDS password"
            />
            <div className={styles.ctaContainer}>
              <motion.button
                onClick={login}
                disabled={checkingUser}
                className="btn primaryCta"
                type="button"
              >
                {checkingUser ? (
                  <motion.i className="fas mr-2 fa-circle-notch fa-spin" />
                ) : (
                  'Connect'
                )}
                {checkingUser && 'Checking...'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}

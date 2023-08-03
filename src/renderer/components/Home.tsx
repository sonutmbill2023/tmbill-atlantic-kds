import React, { useEffect, useState, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Badge,
  Modal,
  Row,
  Col,
  Card,
  Drawer,
  Menu,
  MenuProps,
  Switch,
} from 'antd';
import { SyncOutlined, LogoutOutlined } from '@ant-design/icons';
import { HiOutlineTicket } from 'react-icons/hi';
import { RxHamburgerMenu } from 'react-icons/rx';
import { GiChefToque } from 'react-icons/gi';
import { forEach, map } from 'lodash';
import { useHotkeys } from 'react-hotkeys-hook';
import { showNotification } from './Antnotify';
import Noorders from './Noorders';
import TablekotView from '../containers/TablekotView';
import OrderkotView from '../containers/OrderkotView';
import {
  getRunningtable,
  resetState,
  settleAll,
  toggleshowBumporders,
} from '../redux/actions/Master';
import { getKOTnotification, Howl } from '../utils/Howler';
import { APP_SETTINGS } from '../utils/Settings';
import routes from '../constants/routes.json';
import {
  KDS_EVENTS,
  ORDER_EVENTS as ORDER_WSEVENTS,
  STATUS_FOR_BUMP,
  STATUS_FOR_SERVED,
  STATUS_WITHOUT_BUMP,
} from '../constants/constants';
import { SocketIOProvider } from '../SocketIOhooks';
import { Links } from '../config/common';
import SIOClientcomponent from './Socketioclient/SIOClientcomponent';
import styles from './Home.module.css';
import { SwalInstance } from './notifications/Swal';
import TokenDisplay from '../containers/TokenDisplay';
import useLocalStorage from '../hooks/useLocalStorage';
import { settingsMenuitems } from './Settings/SettingsMenu';
import { SOCKET_IO_EVENTS, STORE_IPC } from '../../constant/IPCEvents';
import { IKeyBasedSettings, ISettings } from '../types/Settings';
import { nativekeyBy } from '../utils/MiscUtils';
import { initializeSettings } from './Settings/misc/SettingsUtils';
import { THREE_MINUTES } from '../../constant';
import { IMasterState } from '../types/Store';

let howlerInstance: Howl;

type HomestateProp = {
  masterReducer: IMasterState;
};

type Props2 = {
  children: ReactNode;
};

export function SocketProvider({ children }: Props2) {
  const connectionOptions = {};
  if (process.env.NODE_ENV === 'development') {
    Object.assign(connectionOptions, {
      reconnectionAttempts: 1,
    });
  }

  return (
    <SocketIOProvider
      url={`${Links.SERVER_API_URL}?token=${Links.TOKEN}`}
      namespaces={[]}
      connectionOptions={connectionOptions}
    >
      {children}
    </SocketIOProvider>
  );
}

const speakMessage = new SpeechSynthesisUtterance();

export default function Home(): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingData, setloadingData] = useState(true);
  const [currentDisplay, setcurrentDisplay] = useLocalStorage<string>(
    'CURRENT_DISPLAY',
    'NA',
  );
  const [showselectDisplay, setshowselectDisplay] = useState(
    !['KDS', 'TOKEN'].includes(currentDisplay),
  );
  const [showtokenDisplay, setshowtokenDisplay] = useState(
    currentDisplay === 'TOKEN',
  );
  //console.log(currentDisplay,'sowtokendisplay line 103')
  const userDetails = useSelector(
    (state: HomestateProp) => state.masterReducer.userDetails,
  );
  const storeDetails = useSelector(
    (state: HomestateProp) => state.masterReducer.storeDetails,
  );
  const tokenExpired = useSelector(
    (state: HomestateProp) => state.masterReducer.tokenExpired,
  );
  const showbumpOrders = useSelector(
    (state: HomestateProp) => state.masterReducer.showbumpOrders,
  );
  const runningtablekotDetails = useSelector(
    (state: HomestateProp) => state.masterReducer.runningtablekotDetails,
  );

   console.log(runningtablekotDetails, 'from runningtablekotDetails useSelector');
  const settledOrders = useSelector(
    (state: HomestateProp) => state.masterReducer.settledOrders,
  );
   console.log( settledOrders , 'from settledOrders useSelector');
  const [, setuserCredentials] = useLocalStorage<string>('USER_CREDS', '');

  const [totalCount, settotalCount] = useState(0);
  const [settingsDrawer, setsettingsDrawer] = useState(false);
  const [storeid] = useState<string>(
    storeDetails ? storeDetails.store_id || '' : '',
  );

  // const runningtablekotDetails = useSelector(
  //   (state: HomestateProp) => state.masterReducer.
  // );

  // const [showTokennumber] = useState(
  //   POS_SETTINGS &&
  //     POS_SETTINGS[SETTING_NAMES.SHOW_TOKEN] &&
  //     [1, '1'].includes(POS_SETTINGS[SETTING_NAMES.SHOW_TOKEN].value)
  // );

  // const [settings, setSettings] = useState<IKeyBasedSettings>();

  useHotkeys(['ctrl+k', 'command+k'], () =>
    setshowselectDisplay(!showselectDisplay),
  );

  useHotkeys(['ctrl+s', 'command+s'], () => navigate(routes.SETTINGS.CATEGOEY));

  const sendRequest = () => {
    if (storeid) {
      dispatch(
        getRunningtable(
          storeid,
          showbumpOrders ? STATUS_FOR_BUMP : STATUS_WITHOUT_BUMP,
          {
            showQsrorders: APP_SETTINGS.SHOW_SETTLED_ORDER.SHOW_QSRORDERS,
            showOnlineorders: APP_SETTINGS.SHOW_SETTLED_ORDER.SHOW_ONLINEORDERS,
            showDigitalorders:
              APP_SETTINGS.SHOW_SETTLED_ORDER.SHOW_DIGITALORDERS,
            assignedKitchedeps: userDetails?.data?.assignedKitchedeps || '',
            showAllorders: true,
          },
        ),
      );
    } else {
      navigate(routes.FINDMASTER);
    }
  };

  const alertTokenready = (eventPayload?: any) => {
    showNotification({
      message: `Order is ready for token number ${eventPayload.kot_id}`,
      icon: 'info',
    });

    speakMessage.text = `Order is ready for token number ${eventPayload.kot_id}`;
    // speakMessage.voice
    speechSynthesis.speak(speakMessage);
  };

  const handleSocketevents = (eventPayload?: any) => {
    try {
      if (eventPayload && eventPayload.event) {
        switch (eventPayload.event) {
          case ORDER_WSEVENTS.KOT_UPDATED:
          case KDS_EVENTS.KOT_UPDATED:
            if (showtokenDisplay && [5, 4].includes(eventPayload.status)) {
              alertTokenready(eventPayload);
            }
            break;

          default:
            break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrenttablesdata = (message?: string, event?: any) => {
    // console.log('getCurrenttablesdata');
    setloadingData(true);
    if (message && !showtokenDisplay) {
      showNotification({ message, icon: 'info' });
    }

    sendRequest();
    if (!showtokenDisplay) {
      if (howlerInstance === undefined) {
        howlerInstance = getKOTnotification();
        howlerInstance.load();
      }
      howlerInstance.play();
    }

    if (event) handleSocketevents(event);
  };

  const handleGetsettingslist = (arg: unknown) => {
    const parsedArgs = arg as ISettings[];
    if (parsedArgs && parsedArgs.length) {
      const newSettings = nativekeyBy(parsedArgs, 'id') || {};
      // setSettings(newSettings);
      initializeSettings(newSettings);
    }
  };

  const getSettings = () => {
    window.electron.ipcRenderer.sendMessage(STORE_IPC.GET_DASH_SETTINGS, []);
  };

  useEffect(() => {
    sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails]);

  useEffect(() => {
    if (tokenExpired) {
      navigate(routes.FINDMASTER);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenExpired]);

  useEffect(() => {
    howlerInstance = getKOTnotification();
    howlerInstance.load();

    window.electron.ipcRenderer.sendMessage(SOCKET_IO_EVENTS.INIT_SOCKET, [
      { token: Links.TOKEN, url: Links.SERVER_API_URL, tokenExpired },
    ]);

    window.electron.ipcRenderer.on(
      STORE_IPC.GET_DASH_SETTINGS,
      handleGetsettingslist,
    );

    getSettings();

    const interval = setInterval(() => {
      getCurrenttablesdata();
    }, THREE_MINUTES);

    return () => {
      clearInterval(interval);
      if (howlerInstance) {
        howlerInstance.unload();
      }
    };
  }, []);

  useEffect(() => {
    if (loadingData) setloadingData(false);
  }, [loadingData]);

  const renderRunningtables = () => {
    return runningtablekotDetails.map((element: any, index: number) => {
      return element.items && element.items.length > 0 ? (
        <TablekotView key={element.in_time} details={element} index={index} />
      ) : null;
    });
  };

  const renderSettledorderkots = () => {
    return settledOrders.map((element: any, index: number) => {
      return element.tmpos_order_child &&
        element.tmpos_order_child.length > 0 ? (
        <OrderkotView key={element.order_id} details={element} index={index} />
      ) : null;
    });
  };

  const logout = () => {
    // dispatch reset state
    dispatch(resetState());
    navigate(routes.FINDMASTER);
    setuserCredentials('');
  };

  const toggleBumpordercheck = () => {
    dispatch(toggleshowBumporders());
  };

  useEffect(() => {
    setTimeout(() => {
      sendRequest();
    }, 200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showbumpOrders]);

  useEffect(() => {
    let count = 0;
    forEach(settledOrders, (order) => {
      if (order.tmpos_order_child && order.tmpos_order_child.length > 0)
        count += 1;
    });

    forEach(runningtablekotDetails, (order) => {
      if (order.items && order.items.length > 0) count += 1;
    });
    settotalCount(count);
  }, [settledOrders, runningtablekotDetails]);



  //****start settle request */
  const sendsettleAllrequest = () => {
    SwalInstance.fire({
      title: 'Do you want to settle all the KOT/Orders?',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: 'Settle',
    })
      .then((result) => {
        if (result.isConfirmed) {
          const kotIdlist = map(runningtablekotDetails, 'kot_id');
          //console.log(kotIdlist, 'sendSettleAll request');
          const orderidlist = map(settledOrders, 'order_id');
          if (storeid) {
            dispatch(
              settleAll({
                kot_id: kotIdlist,
                status: STATUS_FOR_SERVED,
                order_id: orderidlist,
                order_status: 1, // Served Order Flag
              }),
            );
          } else {
            navigate(routes.FINDMASTER);
          }
          setTimeout(() => {
            sendRequest();
          }, 3000);
        }
        return undefined;
      })
      .catch(() => {});
  };

  //end settle request//

  const setView = (value: string) => {
    setcurrentDisplay(value);
    setshowtokenDisplay(value === 'TOKEN');
    setshowselectDisplay(false);
  };

  const onClosedrawer = () => {
    setsettingsDrawer(false);
  };

  const changeView = (checked: boolean) => {
    //console.log(checked,'changeview line 375')
    setshowtokenDisplay(!checked);
    setView(checked ? 'KDS' : 'TOKEN');
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e && e.key) {
      navigate(`/${e.key}`);
    }
  };

  return (
    <SocketProvider>
      <div className={styles.container} data-tid="container">
        <div className={`${styles.homeactionContainer}`}>
          <div>
            {!showtokenDisplay && (
              <>
                <Button
                  className={`mr-2 ${styles.settingButton}`}
                  onClick={() => {
                    setsettingsDrawer(true);
                  }}
                  title="Open Settings"
                  icon={<RxHamburgerMenu size={25} />}
                />

                <Checkbox
                  checked={showbumpOrders}
                  onChange={toggleBumpordercheck}
                >
                  Show bump orders
                </Checkbox>

                <Button
                  onClick={() => {
                    sendRequest();
                  }}
                  className="ml-1"
                  disabled={loadingData}
                  title="Refresh"
                  icon={<SyncOutlined />}
                >
                  Refresh
                </Button>
                <Button
                  onClick={() => {
                    sendsettleAllrequest();
                  }}
                  className="ml-1"
                  disabled={loadingData}
                  title="Settle All"
                >
                  Settle All
                </Button>
                <Button className={styles.totalCount}>
                  {`Total pending KOT's : `}
                  <Badge className={styles.totalCountbage} count={totalCount} />
                </Button>
              </>
            )}
          </div>

          <div className="d-flex">
            <Switch
              title={`Switch View`}
              checkedChildren={
                <GiChefToque style={{ paddingTop: '2px' }} size={16} />
              }
              unCheckedChildren={<HiOutlineTicket size={18} />}
              defaultChecked={!showtokenDisplay}
              onChange={changeView}
            />
            <Button className="ml-2" onClick={logout} icon={<LogoutOutlined />}>
              Logout
            </Button>
          </div>
        </div>

        {totalCount === 0 && <Noorders />}

        <div className={`flex-grid ${styles.tablesContainer}`}>
            {!showtokenDisplay &&
            runningtablekotDetails &&
            Array.isArray(runningtablekotDetails) &&
            runningtablekotDetails.length > 0 &&
            renderRunningtables()}
            {!showtokenDisplay &&
            settledOrders &&
            Array.isArray(settledOrders) &&
            settledOrders.length > 0 &&
            renderSettledorderkots()}
        </div>

        {showtokenDisplay && totalCount > 0 && (
          <TokenDisplay
            runningKOTlist={
              runningtablekotDetails &&
              Array.isArray(runningtablekotDetails) &&
              runningtablekotDetails.length > 0
                ? runningtablekotDetails
                : []
            }
            settledList={
              settledOrders &&
              Array.isArray(settledOrders) &&
              settledOrders.length > 0
                ? settledOrders
                : []
            }
          />
        )}
        {storeid && !tokenExpired && (
          <SIOClientcomponent getCurrenttablesdata={getCurrenttablesdata} />
        )}

        <Modal
          closable={false}
          title="Select Display"
          centered
          open={showselectDisplay}
          footer={null}
        >
          <Row gutter={16}>
            <Col span={2}>&nbsp;</Col>
            <Col span={8}>
              <Card
                title="Kitchen Display"
                onClick={() => {
                  setView('KDS');
                }}
                className={showtokenDisplay ? '' : 'selected'}
                style={{ width: 180 }}
              >
                <GiChefToque color="#61876E" size={120} />
              </Card>
            </Col>
            <Col span={3}>&nbsp;</Col>
            <Col span={8}>
              <Card
                title="Token Display"
                onClick={() => {
                  setView('TOKEN');
                }}
                className={showtokenDisplay ? 'selected' : ''}
                style={{ width: 180 }}
              >
                <HiOutlineTicket color="#61876E" size={120} />
              </Card>
            </Col>
          </Row>
        </Modal>

        <Drawer
          title="TMBill KDS Settings"
          placement="left"
          onClose={onClosedrawer}
          open={settingsDrawer}
          width={310}
          className={`drawer`}
          // footer={<>Version:${}</>}
        >
          <Menu
            onClick={handleMenuClick}
            style={{ width: 310 }}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['dashboard']}
            mode="inline"
            items={settingsMenuitems}
          />
        </Drawer>
      </div>
    </SocketProvider>
  );
}

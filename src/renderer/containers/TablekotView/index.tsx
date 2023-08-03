import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import { List, Spin, Popover, Button, Menu, Dropdown, MenuProps } from 'antd';
import { motion } from 'framer-motion';
import { MdDeliveryDining, MdWatchLater } from 'react-icons/md';
import { GiPaperBagFolded } from 'react-icons/gi';
import { ImSpoonKnife } from 'react-icons/im';
import uniqueId from 'lodash/uniqueId';
import {
  KOT_STATES,
  KOT_ITEM_STATUS,
  KOTITEM_STATUS,
  KDS_EVENTS,
} from '../../constants/constants';
import {
  upadteKOTstatus,
  upadteKOTitemstatus,
} from '../../redux/actions/Master';
import { ReduxState, ItemType, Tableinfo } from '../../types';
import styles from './TablekotView.module.css';
import { useEmit } from '../../SocketIOhooks';
import { diffMinutes, gettimeelapsedClass } from '../../utils/MiscUtils';

const PLACED_KOT = 1;
const BUMPED_KOT = 2;
const SERVED_KOT = 5;
const READY_KOT = 4;

type PropTypes = {
  details: Tableinfo;
  index: number;
};

type ItemcontextType = {
  item: ItemType;
  index: number;
};
export default function TablekotView({ details, index }: PropTypes) {
  const dispatch = useDispatch();
  const [updatingStatus, setupdatingStatus] = useState(false);
  const [currentItemcontextmenu, setcurrentItemcontextmenu] =
    useState<ItemcontextType>();
  const [showpopover, setshowpopover] = useState(false);
  const [timeElapsed, settimeElapsed] = useState(
    differenceInMinutes(new Date(), details.in_time),
  );
  const sendSocketevent = useEmit(KDS_EVENTS.KOT_UPDATED);
  const sendkotitemupdateSocketevent = useEmit(KDS_EVENTS.ITEM_STATUS_CHANGED);
  const sendkdskotStatusupdated = useEmit(KDS_EVENTS.KOT_STATUS_UPDATES);
  const [minutes, setMinutes] = useState(0);

  const status = useSelector(
    (state: ReduxState) =>
      state.masterReducer.runningtablekotDetails[index].status,
  );

  const bumptheState = () => {
    setupdatingStatus(true);
    if (status !== SERVED_KOT) {
      const newStatus = status === PLACED_KOT ? status + 2 : status + 1;
      dispatch(
        upadteKOTstatus({
          kot_id: details.kot_id,
          status: status === BUMPED_KOT ? PLACED_KOT : newStatus,
          miscData: { index },
        }),
      );

      setTimeout(() => {
        sendSocketevent({
          table_id: details.table_id,
          kot_id: details.kot_id,
          status: status === BUMPED_KOT ? PLACED_KOT : newStatus,
        });
      }, 400);
    }
  };

  const bumpState2 = (newStatus: number) => {
    setupdatingStatus(true);
    dispatch(
      upadteKOTstatus({
        kot_id: details.kot_id,
        status: newStatus,
        miscData: { index },
      }),
    );
    setTimeout(() => {
      sendSocketevent({
        table_id: details.table_id,
        kot_id: details.kot_id,
        status: newStatus,
        table_name: details.table_name,
      });
      sendkdskotStatusupdated({
        table_id: details.table_id,
        kot_id: details.kot_id,
        status: newStatus,
        table_name: details.table_name,
      });
    }, 400);
    setshowpopover(false);
  };

  const updateItemstate = (newState: string) => {
    if (
      currentItemcontextmenu !== undefined &&
      currentItemcontextmenu.item !== undefined &&
      currentItemcontextmenu.item.kot_item_id !== undefined
    ) {
      dispatch(
        upadteKOTitemstatus({
          kot_item_id: currentItemcontextmenu.item.kot_item_id,
          orderstatus: newState,
          miscData: {
            parentIndex: index,
            itemIndex: currentItemcontextmenu.index,
          },
        }),
      );

      setTimeout(() => {
        sendkotitemupdateSocketevent({
          kot_item_id: currentItemcontextmenu.item.kot_item_id,
          orderstatus: newState,
        });
      }, 400);
    }
  };

  const onMenuItemcontextClick: MenuProps['onClick'] = ({ key }) => {
    try {
      const itemDetails = JSON.parse(window.atob(key));
      updateItemstate(itemDetails.itemState);
    } catch (error) {}
  };

  const getMenuItemcontext = () => {
    const childs = Object.values(KOTITEM_STATUS).map((itemState) => ({
      label: itemState,
      key: window.btoa(
        JSON.stringify({ id: uniqueId('context_item_'), itemState }),
      ),
    }));
    return childs;
  };

  const setCurrentitemcontext = (
    isVisible: boolean,
    itemClicked: ItemType,
    itemIndex: number,
  ) => {
    if (isVisible) {
      setcurrentItemcontextmenu({ item: itemClicked, index: itemIndex });
    } else {
      setcurrentItemcontextmenu(undefined);
    }
  };

  useEffect(() => {
    if (updatingStatus && status !== SERVED_KOT) {
      setupdatingStatus(!updatingStatus);
    }
  }, [status, updatingStatus]);

  const KOTStatuspopup = KOT_STATES.map((state: string, stateIndex: number) => (
    <div key={uniqueId('state_')}>
      <Button
        onClick={() => {
          bumpState2(stateIndex + 1);
        }}
        className={`${styles.stateupdateButton2} ${
          String(KOT_STATES[status - 1]).toLowerCase() ===
          String(state).toLowerCase()
            ? 'selected'
            : ''
        }`}
      >
        {String(state).toUpperCase()}
      </Button>
    </div>
  ));

  const tick = () => {
    settimeElapsed(differenceInMinutes(new Date(), details.in_time));
    const timeEnd = new Date();
    const timeStart = new Date(details.in_time);
    const tempminutes = diffMinutes(timeEnd, timeStart);
    setMinutes(tempminutes);
  };

  useEffect(() => {
    tick();
    const timer = setInterval(tick, 10000);
    return () => clearInterval(timer);
  }, []);

console.log(details,'from tablekot view')

  return (
    <Spin
      tip={`${updatingStatus ? 'Updating KOT status' : ''}`}
      spinning={updatingStatus}
    >
      <motion.div
        animate={{
          scale: [0.4, 1],
        }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
        onDoubleClick={() => {
          bumptheState();
        }}
        className={`${styles.container} ${
          status === SERVED_KOT ? 'hide' : ''
        } ${status === READY_KOT ? 'kot_ready' : ''}`}
      >
        <div className={`${styles.header} ${gettimeelapsedClass(minutes)}`}>
          <div title="Table" className={styles.tableName}>
            <div className={`blinkr ${styles.orderTypecontainer}`}>
              {Number(details.order_type_flag) === 0 && <ImSpoonKnife />}
              {Number(details.order_type_flag) === 5 && <ImSpoonKnife />}

              {Number(details.order_type_flag) === 1 && <GiPaperBagFolded />}

              {Number(details.order_type_flag) === 2 && <MdDeliveryDining />}
            </div>
          <span className={styles.header_table_name}>  {details.table_name} </span>

          </div>
          <div
            className={styles.kotnotitle}
          >{`KOT : ${details.kot_number}`}</div>
          <div className={styles.serverInfo}>
            <div title={`Served by ${details.createdBy}`}>
              {details.createdBy}
            </div>
          </div>
        </div>

        <div className={styles.kotitemsListcontainer}>
          {details.note && (
            <div title={`Note:${details.note}`} className={`${styles.kotnote}`}>
              {details.note}
            </div>
          )}
          <List
            className={`${styles.kotitemListwrapper}`}
            size="small"
            dataSource={details.items}
            renderItem={(item: ItemType, itemIndex: number) => (
              // status :1=placed , 2=deleted , 3=cancelled , 4= edited

              <List.Item className={styles.antlistItem}>
                <div
                  className={`${styles.itemQunatity} ${
                    [KOT_ITEM_STATUS.EDITED].includes(item.status)
                      ? styles.editedQunatity
                      : ''
                  }`}
                  title={`${
                    [KOT_ITEM_STATUS.EDITED].includes(item.status)
                      ? 'Quantity updated'
                      : ''
                  }`}
                >
                  {`${item.quantity} `}
                </div>
                <div className={styles.itemQuantitymultiply}>x</div>
                <div className={styles.itemTitlecontainer}>
                  <div className="w-full">
                    <div
                      className={`${
                        [
                          KOT_ITEM_STATUS.CANCELLED,
                          KOT_ITEM_STATUS.DELETED,
                        ].includes(item.status)
                          ? `w-full ${styles.redTitle}`
                          : 'w-full'
                      }`}
                      title={
                        [
                          KOT_ITEM_STATUS.CANCELLED,
                          KOT_ITEM_STATUS.DELETED,
                        ].includes(item.status) && item.reason
                          ? `Reason:${item.reason}`
                          : ''
                      }
                    >
                      <Dropdown
                        onOpenChange={(value) => {
                          setCurrentitemcontext(value, item, itemIndex);
                        }}
                        menu={{
                          items: getMenuItemcontext(),
                          onClick: onMenuItemcontextClick,
                        }}
                        trigger={['contextMenu']}
                      >
                        <div
                          className={`w-full ${styles.statuslabel} ${`${
                            [
                              KOT_ITEM_STATUS.CANCELLED,
                              KOT_ITEM_STATUS.DELETED,
                            ].includes(item.status)
                              ? styles.item_cancelled
                              : styles[
                                  String(`item_${String(item.orderstatus)}`)
                                    .toLowerCase()
                                    .replace(/ /g, '')
                                ]
                          }`}`}
                        >
                          {item.title}
                        </div>
                      </Dropdown>
                    </div>
                    {item.note && (
                      <div
                        title="Item Note"
                        className={`${styles.itemnote} ${styles.statuslabel}`}
                      >
                      <span  className={styles.itemnote_color }>{item.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>

        <div className={`${styles.footer} ${gettimeelapsedClass(minutes)}`}>
          <div title="Time elapsed " className={styles.timepassed}>
            <MdWatchLater />
            {timeElapsed ? (
              <div className="ml-1">{`${timeElapsed} min ago`}</div>
            ) : (
              <div className="ml-1">{`Just Placed`}</div>
            )}
          </div>
          {details.persons == 0? "" : (
            <div className={`${styles.personsWrapper}`}>
              C/G : {details.persons}
            </div>
          )  }

          <div className={styles.currentStatecontainer}>
            <Popover
              style={{ width: '130px' }}
              content={KOTStatuspopup}
              title="Update State"
              trigger="click"
              open={showpopover}
            >
              <Button
                onClick={() => {
                  setshowpopover(!showpopover);
                }}
                className={`current_kot_state ${styles.stateupdateButton} ${
                  styles[KOT_STATES[status - 1]]
                }`}
              >
                {KOT_STATES[status - 1]}
              </Button>
            </Popover>
          </div>
        </div>
      </motion.div>
    </Spin>
  );
}

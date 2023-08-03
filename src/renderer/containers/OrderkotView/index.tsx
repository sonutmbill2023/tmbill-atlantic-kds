import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Spin, Popover, Button } from 'antd';
import { MdWatchLater } from 'react-icons/md';
import { GiHotMeal } from 'react-icons/gi';
import { RiTakeawayLine } from 'react-icons/ri';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import uniqueId from 'lodash/uniqueId';
import { motion } from 'framer-motion';
import { upadteorderKOTstatus } from '../../redux/actions/Master';
import {
  KOT_STATES_FOR_SETTLED,
  BILLTYPES,
  KDS_EVENTS,
} from '../../constants/constants';
import styles from '../TablekotView/TablekotView.module.css';
import { useEmit } from '../../SocketIOhooks';
import zomato from '../../assets/zomato.png';
import swiggy from '../../assets/swiggy.png';
import { diffMinutes, gettimeelapsedClass } from '../../utils/MiscUtils';
import { POS_SETTINGS } from '../../config/common';
import { SETTING_NAMES } from '../../../constant/Settings.constant';
import {
  CurrentReduxState,
  IMasterState,
  ISettledOrder,
  TmposOrderChild,
} from '../../types/Store';
import { BILLINGTYPES_MAP, BILLING_TYPES } from '../../../constant';

const PLACED_KOT = 2;
const BUMPED_KOT = 3;
const READY_KOT = 5;
const SERVED_KOT = 1;

type PropTypes = {
  details: ISettledOrder;
  index: number;
};

export default function OrderkotView({ details, index }: PropTypes) {
  const dispatch = useDispatch();
  const sendkdskotStatusupdated = useEmit(KDS_EVENTS.KOT_STATUS_UPDATES);
  const [showpopover, setshowpopover] = useState(false);

  const [showTokennumber] = useState(
    POS_SETTINGS &&
      POS_SETTINGS[SETTING_NAMES.SHOW_TOKEN] &&
      [1, '1'].includes(POS_SETTINGS[SETTING_NAMES.SHOW_TOKEN].value)
  );
  const [timeElapsed, settimeElapsed] = useState(
    differenceInMinutes(new Date(), details.created_time)
  );
  const [updatingStatus, setupdatingStatus] = useState(false);
  const [minutes, setMinutes] = useState(0);

  const status = useSelector(
    (state: CurrentReduxState) =>
      state.masterReducer.settledOrders[index].order_flag
  );

  const bumptheState = () => {
    setupdatingStatus(true);
    if (status !== SERVED_KOT) {
      let newStatus = status === PLACED_KOT ? status + 2 : status + 1;
      if (status >= READY_KOT) {
        newStatus = SERVED_KOT;
      }
      dispatch(
        upadteorderKOTstatus({
          order_id: details.order_id,
          status: status === BUMPED_KOT ? PLACED_KOT : newStatus,
          miscData: { index },
          previousStatus: status,
        })
      );
    }
  };

  const bumpState2 = (newStatus: number) => {
    setupdatingStatus(true);
    dispatch(
      upadteorderKOTstatus({
        order_id: details.order_id,
        status: newStatus,
        miscData: { index },
        previousStatus: status,
      })
    );
    setshowpopover(false);
    sendkdskotStatusupdated({
      forOrder: true,
      order_id: details.order_id,
      status: newStatus,
    });
  };

  const tick = () => {
    settimeElapsed(differenceInMinutes(new Date(), details.created_time));
    const timeEnd = new Date();
    const timeStart = new Date(details.created_time);
    const tempminutes = diffMinutes(timeEnd, timeStart);
    setMinutes(tempminutes);
  };

  const KOTStatuspopup = KOT_STATES_FOR_SETTLED.map(
    (state: string, stateIndex: number) => (
      <div key={uniqueId('state_')}>
        <Button
          onClick={() => {
            bumpState2(stateIndex + 1);
          }}
          className={`${styles.stateupdateButton2} ${
            String(KOT_STATES_FOR_SETTLED[status - 1]).toLowerCase() ===
            String(state).toLowerCase()
              ? 'selected'
              : ''
          }`}
        >
          {String(state).toUpperCase()}
        </Button>
      </div>
    )
  );

  useEffect(() => {
    tick();
    const timer = setInterval(tick, 10000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (updatingStatus && status !== SERVED_KOT) {
      setupdatingStatus(!updatingStatus);
    }
  }, [status, updatingStatus]);

  useEffect(() => {
    // console.log("timeElapsed "+timeElapsed)

    tick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minutes]);

  const getOrdernumber = () => {
    let number = '';
    if (details) {
      // details.billing_type == 0
      // ? billNumber
      number = details.order_id.slice(-4);

      if (
        details.billing_type === BILLING_TYPES.QUICKBILL &&
        showTokennumber &&
        details.extra_details &&
        details.extra_details.order_number
      ) {
        // Show Token
        number = String(details.extra_details.order_number);
      }
    }
    return number;
  };

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
              {Number(details.billing_type) === BILLING_TYPES.QUICKBILL && (
                <GiHotMeal />
              )}

              {Number(details.billing_type) === BILLING_TYPES.ZOMATO && (
                <img src={zomato} alt="Zomato" />
              )}

              {Number(details.billing_type) === BILLING_TYPES.SWIGGY && (
                <img src={swiggy} alt="Swiggy" />
              )}

              {Number(details.billing_type) === BILLING_TYPES.DIGITALORDER &&
                details.order_flag === 2 && "" }

              <img
                className={styles.billingtypeImg}
                src={
                  BILLINGTYPES_MAP[String(details.billing_type || '0')]?.icon
                }
                alt={
                  BILLINGTYPES_MAP[String(details.billing_type || '0')]?.name
                }
              />
            </div>
          <span className={styles.header_table_name }> {BILLTYPES[details.billing_type || '0']}</span>
          </div>
          <div className={styles.kotnotitle} title={details.order_id}>
            {`Order : ${getOrdernumber()}`}
          </div>
          <div className={styles.serverInfo}>
            <div title={`Served by ${details.user_id}`}>{details.user_id}</div>
          </div>
        </div>

        <div className={styles.kotitemsListcontainer}>
          {details.instructions && (
            <div
              title={`Note:${details.instructions}`}
              className={`${styles.kotnote}`}
            >
              {details.instructions}
            </div>
          )}
          <List
            size="small"
            dataSource={details.tmpos_order_child}
            renderItem={(item: TmposOrderChild) => (
              // status :1=placed , 2=deleted , 3=cancelled , 4= edited

              <List.Item className={styles.antlistItem}>
                <div className={`${styles.itemQunatity}`}>
                  {`${item.quantity} `}
                </div>
                <div className={styles.itemQuantitymultiply}>x</div>
                <div className={styles.itemTitlecontainer}>
                  <div>
                    <div>{item.title}</div>
                    {item.note && (
                      <div title="Item Note" className={styles.itemnote}>
                      <span> {item.note}</span>
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
          {details.persons && (
            <div className={`${styles.personsWrapper}`}>
              C/G : {details.persons}
            </div>
          )}

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
                  styles[KOT_STATES_FOR_SETTLED[status - 1]]
                }`}
              >
                {KOT_STATES_FOR_SETTLED[status - 1]}
              </Button>
            </Popover>
          </div>
        </div>
      </motion.div>
    </Spin>
  );
}

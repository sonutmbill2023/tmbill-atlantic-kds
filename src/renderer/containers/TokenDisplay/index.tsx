/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from 'react';
import { Divider, List, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import styles from './TokenDisplay.module.css';
import {
  BILL_STATES_BYFLAG,
  KOT_STATES_BYFLAG,
  KOT_STATES,
  KOT_STATES_FOR_SETTLED,
} from '../../constants/constants';
import { sortBy } from '../../utils/MiscUtils';
import { IRunningtablekotDetail, ISettledOrder } from '../../types/Store';
import { BILLING_TYPES } from '../../../constant';
import { POS_SETTINGS } from '../../config/common';
import { SETTING_NAMES } from '../../../constant/Settings.constant';

type Props = {
  runningKOTlist: IRunningtablekotDetail[];
  settledList: ISettledOrder[];
};

type TokenList2 = {
  time: number;
  token: string;
  status: string;
};

type TokenList = {
  [key: string]: string[];
};
function TokenDisplay({ runningKOTlist, settledList }: Props) {
  const navigate = useNavigate();
  const [preparingList, setpreparingList] = useState<string[]>([]);
  const [placedList, setplacedList] = useState<string[]>([]);
  const [readyList, setreadyList] = useState<string[]>([]);
  const [showTokennumber] = useState(
    POS_SETTINGS &&
      POS_SETTINGS[SETTING_NAMES.SHOW_TOKEN] &&
      [1, '1'].includes(POS_SETTINGS[SETTING_NAMES.SHOW_TOKEN].value)
  );

  // If the useEffect's second param is empty.
  // it means it is mounted.
  useEffect(() => {
    let rawpreparingList: TokenList2[] = [];
    let rawplacedList: TokenList2[] = [];
    let rawreadyList: TokenList2[] = [];

    if (runningKOTlist && runningKOTlist.length) {
      runningKOTlist.map(
        (currentKOT: IRunningtablekotDetail, index: number) => {
          switch (currentKOT.status) {
            case KOT_STATES_BYFLAG.PREPARING:
              rawpreparingList.push({
                time: currentKOT.in_time || 0,
                token: `${currentKOT.kot_number || currentKOT.kot_id}`,
                status: 'Preparing',
              });
              break;
            case KOT_STATES_BYFLAG.READY:
              rawreadyList.push({
                time: currentKOT.in_time || 0,
                token: `${currentKOT.kot_number || currentKOT.kot_id}`,
                status: 'Ready',
              });
              break;
            case KOT_STATES_BYFLAG.PLACED:
              rawplacedList.push({
                time: currentKOT.in_time || 0,
                token: `${currentKOT.kot_number || currentKOT.kot_id}`,
                status: 'Placed',
              });
              break;
            default:
              break;
          }
        }
      );
    }

    if (settledList && settledList.length) {
      settledList.map((currentKOT: ISettledOrder, index: number) => {
        let token = String(currentKOT?.order_id || '').slice(-4);

        if (currentKOT.billing_type === 0 && currentKOT.bill_number) {
          token = String(currentKOT.bill_number);
        }

        if (
          currentKOT.billing_type === BILLING_TYPES.QUICKBILL &&
          showTokennumber &&
          currentKOT.extra_details &&
          currentKOT.extra_details.order_number
        ) {
          // Show Token
          token = String(currentKOT.extra_details.order_number);
        }

        switch (currentKOT.order_flag) {
          case BILL_STATES_BYFLAG.PREPARING:
            rawpreparingList.push({
              time: currentKOT.created_time || 0,
              token: `${token}`,
              status: 'Preparing',
            });
            break;
          case BILL_STATES_BYFLAG.READY:
            rawreadyList.push({
              time: currentKOT.created_time || 0,
              token: `${token}`,
              status: 'Ready',
            });
            break;
          case BILL_STATES_BYFLAG.PLACED:
            rawplacedList.push({
              time: currentKOT.created_time || 0,
              token: `${token}`,
              status: 'Placed',
            });
            break;
          default:
            break;
        }
      });
    }

    rawpreparingList = rawpreparingList.concat().sort(sortBy('time'));
    rawplacedList = rawplacedList.concat().sort(sortBy('time'));
    rawreadyList = rawreadyList.concat().sort(sortBy('time'));

    let newpreparingList: string[] = [];
    let newplacedList: string[] = [];
    let newreadyList: string[] = [];
    rawpreparingList.map((currentKOT: TokenList2) => {
      newpreparingList.push(currentKOT.token);
    });
    rawplacedList.map((currentKOT: TokenList2) => {
      newplacedList.push(currentKOT.token);
    });
    rawreadyList.map((currentKOT: TokenList2) => {
      newreadyList.push(currentKOT.token);
    });

    setpreparingList(newpreparingList);
    setplacedList(newplacedList);
    setreadyList(newreadyList);
  }, [runningKOTlist, settledList]);

  return (
    <div className={`${styles.tokensContainer}`}>
      <List
        // grid={{ gutter: 1, column: placedList.length > 10 ? 3 : 1 }}
        className={`tokenlistContainer ${styles.tokenlistContainer}`}
        size="large"
        header={
          <div style={{ fontSize: '30px' }} className="placed">
            Placed
          </div>
        }
        dataSource={placedList}
        renderItem={(item) => (
          <List.Item className={`placed ${styles.tokenNumber}`}>
            {item}
          </List.Item>
        )}
      />

      <List
        className={`tokenlistContainer ${styles.tokenlistContainer}`}
        size="large"
        header={
          <div style={{ fontSize: '30px' }} className="preparing">
            Preparing
          </div>
        }
        dataSource={preparingList}
        renderItem={(item) => (
          <List.Item className={`preparing ${styles.tokenNumber}`}>
            {item}
          </List.Item>
        )}
      />

      <List
        className={`tokenlistContainer ${styles.tokenlistContainer}`}
        size="large"
        header={
          <div style={{ fontSize: '30px' }} className="ready">
            Ready
          </div>
        }
        dataSource={readyList}
        renderItem={(item) => (
          <List.Item className={`ready ${styles.tokenNumber}`}>
            {item}
          </List.Item>
        )}
      />
    </div>
  );
}
export default TokenDisplay;

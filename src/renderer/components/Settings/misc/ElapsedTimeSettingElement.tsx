import React, { useEffect, useState } from 'react';
import { Button, Col, InputNumber, Row, Tag } from 'antd';

import styles from '../GeneralSettings.module.css';
import { debounce } from 'lodash';
import { INTERVALS } from './SettingsUtils';
import { KOT_COLOR_SETTINGS } from '../../../../constant/Settings.constant';
import { showNotification } from '../../Antnotify';

type Settings = {
  id: number;
  title: string;
  value: string;
};

type Props = {
  settingInfo: Settings;
  updateSetting: (data: Settings) => void;
};

export default function ElapsedTimeSettingElement({
  settingInfo,
  updateSetting,
}: Props) {
  const [settingsData, setsettingsData] = useState(
    JSON.parse(settingInfo.value || '')
  );

  const onColorChange = (key: string, value: any) => {
    const newSettings = {
      ...settingsData,
      [key]: {
        ...settingsData[key],
        ...value,
      },
    };
    setsettingsData(newSettings);
  };

  const sendUpdatesettings = () => {
    updateSetting({
      ...settingInfo,
      value: JSON.stringify(settingsData),
    });
    showNotification({
      message: `KOT Color Setting Updated.`,
      icon: 'info',
    });
  };

  const resetSettings = () => {
    const newSettings = {
      ...settingInfo,
      value: JSON.stringify(KOT_COLOR_SETTINGS),
    };

    updateSetting({
      ...settingInfo,
      value: JSON.stringify(KOT_COLOR_SETTINGS),
    });
    setsettingsData(newSettings);

    showNotification({
      message: `KOT Color Setting Reset Done.`,
      icon: 'info',
    });
  };

  const debouncedChangeHandler = debounce((key, value) => {
    onColorChange(key, value);
  }, 300);

  useEffect(() => {
    // console.log(settingsData);
  }, [settingsData]);

  return (
    <div className={`${styles.settingWrapper}`}>
      <Row>
        <Col className={`${styles.settingsTitlewrapper}`} span={8}>
          <div className={`${styles.settingsTitle}`}>KOT Color Setting</div>
        </Col>
        <Col className={`${styles.settingsValue}`} span={16}>
          <div className={`${styles.themesettingsValue}`}>
            <input
              onChange={(e) => {
                debouncedChangeHandler(INTERVALS.FIRST, {
                  color: e.target.value,
                });
              }}
              type="color"
              defaultValue={settingsData[INTERVALS.FIRST]?.color}
              id={INTERVALS.FIRST}
              className={`${styles.intervalColorinput}`}
            />
            <p className={`${styles.themesettingsValuetitle}`}>
              First Interval
              <Tag
                className={`${styles.timeTag}`}
                bordered={false}
                color="blue"
              >
                In Minutes
              </Tag>
            </p>
            <InputNumber
              min={1}
              defaultValue={settingsData[INTERVALS.FIRST]?.from}
              onChange={(number) => {
                debouncedChangeHandler(INTERVALS.FIRST, {
                  from: number,
                });
              }}
            />
            to
            <InputNumber
              min={1}
              defaultValue={settingsData[INTERVALS.FIRST]?.to}
              onChange={(number) => {
                debouncedChangeHandler(INTERVALS.FIRST, {
                  to: number,
                });
              }}
            />
          </div>
          <div className={`${styles.themesettingsValue}`}>
            <input
              onChange={(e) => {
                debouncedChangeHandler(INTERVALS.SECOND, {
                  color: e.target.value,
                });
              }}
              type="color"
              defaultValue={settingsData[INTERVALS.SECOND]?.color}
              id={INTERVALS.SECOND}
              className={`${styles.intervalColorinput}`}
            />
            <p className={`${styles.themesettingsValuetitle}`}>
              Second Interval
              <Tag
                className={`${styles.timeTag}`}
                bordered={false}
                color="blue"
              >
                In Minutes
              </Tag>
            </p>
            <InputNumber
              min={1}
              defaultValue={settingsData[INTERVALS.SECOND]?.from}
              onChange={(number) => {
                debouncedChangeHandler('time-elpased-interval-2', {
                  from: number,
                });
              }}
            />
            to
            <InputNumber
              min={1}
              defaultValue={settingsData[INTERVALS.SECOND]?.to}
              onChange={(number) => {
                debouncedChangeHandler('time-elpased-interval-2', {
                  to: number,
                });
              }}
            />
          </div>
          <div className={`${styles.themesettingsValue}`}>
            <input
              onChange={(e) => {
                debouncedChangeHandler(INTERVALS.THIRD, {
                  color: e.target.value,
                });
              }}
              type="color"
              defaultValue={settingsData[INTERVALS.THIRD]?.color}
              id={INTERVALS.THIRD}
              className={`${styles.intervalColorinput}`}
            />
            <p className={`${styles.themesettingsValuetitle}`}>
              Third Interval
              <Tag
                className={`${styles.timeTag}`}
                bordered={false}
                color="blue"
              >
                In Minutes
              </Tag>
            </p>
            <InputNumber
              min={1}
              defaultValue={settingsData[INTERVALS.THIRD]?.from}
              onChange={(number) => {
                debouncedChangeHandler(INTERVALS.THIRD, {
                  from: number,
                });
              }}
            />
            to
            <InputNumber
              min={1}
              defaultValue={settingsData[INTERVALS.THIRD]?.to}
              onChange={(number) => {
                debouncedChangeHandler(INTERVALS.THIRD, {
                  to: number,
                });
              }}
            />
          </div>
          <div className={`${styles.actionsButton}`}>
            <Button
              className={`mr-2 ${styles.resetsettingButton}`}
              onClick={resetSettings}
              title="Reset"
            >
              Reset
            </Button>

            <Button
              className={`mr-2 ${styles.settingButton}`}
              onClick={sendUpdatesettings}
              title="Update"
            >
              Update
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

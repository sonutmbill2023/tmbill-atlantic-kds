import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Col,
  Divider,
  Input,
  Layout,
  Modal,
  Row,
  Switch,
  Typography,
} from 'antd';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import styles from './GeneralSettings.module.css';
import { STORE_IPC } from '../../../constant/IPCEvents';
import { nativekeyBy } from '../../utils/MiscUtils';
import { debounce } from 'lodash';
import ElapsedTimeSettingElement from './misc/ElapsedTimeSettingElement';
import { IKeyBasedSettings, ISettings } from '../../types/Settings';

const { Title } = Typography;
const { Header, Content } = Layout;

export default function GeneralSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<IKeyBasedSettings>();

  const handleGetsettingslist = (arg: unknown) => {
    const parsedArgs = arg as ISettings[];
    if (parsedArgs && parsedArgs.length) {
      setSettings(nativekeyBy(parsedArgs, 'id') || {});
    }
  };

  const getSettings = () => {
    window.electron.ipcRenderer.sendMessage(STORE_IPC.GET_SETTINGS, []);
  };

  const updateSetting = (data: ISettings) => {
    const newSettings: IKeyBasedSettings = {
      ...settings,
      [data.id]: data,
    };
    setSettings(newSettings);
    window.electron.ipcRenderer.sendMessage(STORE_IPC.UPDATE_SETTINGS, [
      Object.values(newSettings),
    ]);
    return newSettings;
  };

  useEffect(() => {
    setTimeout(getSettings, 300);
    window.electron.ipcRenderer.on(
      STORE_IPC.GET_SETTINGS,
      handleGetsettingslist
    );

    return () => {
      window.electron.ipcRenderer.removeListener(
        STORE_IPC.GET_SETTINGS,
        handleGetsettingslist
      );
    };
  }, []);

  const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const debouncedChangeHandler = useMemo(
    () => debounce(onColorChange, 300),
    []
  );

  return (
    <Layout className={`${styles.categoryWrapper}`}>
      <Header className={`${styles.header}`}>
        <Button
          className={`mr-2 iconButtons`}
          onClick={() => {
            navigate(-1);
          }}
          title="Open Settings"
          icon={<IoArrowBackCircleOutline size={35} />}
        />
        <Title level={3}>General Settings</Title>
      </Header>
      <Content className={`${styles.content}`}>
        <div className={`${styles.settingsContainer}`}>
          {settings && settings[1] && (
            <ElapsedTimeSettingElement
              updateSetting={updateSetting}
              settingInfo={settings[1]}
            />
          )}
        </div>
      </Content>
    </Layout>
  );
}

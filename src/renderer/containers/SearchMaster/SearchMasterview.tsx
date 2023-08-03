import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Service } from 'bonjour-service';
import uniqueId from 'lodash/uniqueId';
import { useHotkeys } from 'react-hotkeys-hook';
import routes from '../../constants/routes.json';
import { MasterLoader } from '../../components/LoaderComponents';
import { setBaseurl } from '../../config/common';
import styles from './SearchMasterview.module.css';
import { IServiceList } from './SearchMaster.dto';
import useLocalStorage from '../../hooks/useLocalStorage';
import { Tag } from 'antd';

type IsUnknown<T> = unknown extends T ? true : never;

const SearchMasterview = () => {
  const navigate = useNavigate();
  const [userCredentials] = useLocalStorage<string>('USER_CREDS', '');
  const [serversList, setserversList] = useState<Service[]>([]);
  useHotkeys(['ctrl+f', 'command+f'], () => searchMasterpos());

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        delayChildren: 0.5,
      },
    },
  };

  // window.electron.ipcRenderer.on(IPC_SERVICE_DISCOVERY.GET_LIST, {});

  const handleGetlist = (arg: unknown) => {
    const parsedArgs = arg as IServiceList;
    console.log(parsedArgs);

    if (parsedArgs) {
      if (parsedArgs.serversList) {
        if (
          parsedArgs.serversList &&
          parsedArgs.serversList.length == 1 &&
          parsedArgs.serversList[0] &&
          userCredentials
        ) {
          const loggedDetails = JSON.parse(userCredentials);
          if (loggedDetails && loggedDetails.storeName) {
            const storeFound = parsedArgs.serversList[0];
            if (
              storeFound &&
              storeFound.txt &&
              storeFound.txt.storeName === loggedDetails.storeName
            )
              conecttoService(storeFound);
          }
        }
        setserversList(parsedArgs.serversList);
      }
    }
  };

  const searchMasterpos = () => {
    window.electron.ipcRenderer.sendMessage(
      'IPC:SERVICE_DISCOVERY:GET_LIST',
      []
    );
  };

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'IPC:SERVICE_DISCOVERY:GET_LIST',
      handleGetlist
    );

    setTimeout(searchMasterpos, 3000);
    return () => {
      window.electron.ipcRenderer.removeListener(
        'IPC:SERVICE_DISCOVERY:GET_LIST',
        handleGetlist
      );
    };
  }, []);

  const conecttoService = (service: Service) => {
    setBaseurl(service.txt.url);
    navigate(routes.LOGIN, {
      state: {
        outlet: service.txt.storeName,
        ipAddress: service.referer && service.referer.address,
        baseUrl: service.txt.url,
        username: service.txt.username || '',
      },
    });
  };

  const renderCurrentmasters = () => {
    return serversList.map((service: Service) => (
      <motion.li
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        // variants={item}
        key={uniqueId()}
      >
        <motion.div className={styles.list_element_card}>
          <div>
            <h4>
              {service.txt.storeName}
              {service.txt.username && (
                <Tag color="geekblue" className="ml-2" bordered={false}>
                  {service.txt.username}
                </Tag>
              )}
            </h4>
            {service.referer && service.referer.address !== undefined && (
              <div>{service.referer.address}</div>
            )}
          </div>
          <div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={() => {
                conecttoService(service);
              }}
              className="btn btn-sm primaryCta connect-to-service"
            >
              Connect
            </motion.button>
          </div>
        </motion.div>
      </motion.li>
    ));
  };

  return (
    <>
      {serversList.length === 0 ? (
        <div className={styles.searchMastersloadercontainer}>
          <h5 className={styles.searchingMastertitle}>
            Searching for master...
          </h5>
          <MasterLoader />
        </div>
      ) : (
        <div className={styles.searchMasterscontainer}>
          <div className={styles.searchMastersresultcontainer}>
            <motion.div transition={{ duration: 2, type: 'tween' }}>
              <h3 className={styles.foundTitle}>Altantic POS found</h3>
              <motion.ul variants={container} initial="hidden" animate="show">
                {renderCurrentmasters()}
              </motion.ul>
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchMasterview;

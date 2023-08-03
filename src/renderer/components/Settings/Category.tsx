import React, {
  ReactElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Button,
  Divider,
  Input,
  Layout,
  Modal,
  Switch,
  Typography,
} from 'antd';
import { IoArrowBackCircleOutline } from 'react-icons/io5';
import debounce from 'lodash/debounce';
import { useNavigate } from 'react-router-dom';
import styles from './Category.module.css';
import { useSelector } from 'react-redux';

import ROUTES from '../../constants/routes.json';
import { MasterReducer } from '../../types';
import { updateCatalouge, usegetCatalouge } from '../../config/apiServices';
import { showNotification } from '../Antnotify';

const { Search } = Input;

const { Title } = Typography;
const { Header, Content } = Layout;

type HomestateProp = {
  masterReducer: MasterReducer;
};

type IUpdateList = {
  item_refid: number | undefined;
  is_active: number;
};
type ICatUpdateList = {
  category_refid: number | undefined;
  is_active: number;
};

export default function CategorySettings(): JSX.Element {
  let itemupdateList: IUpdateList[] = [];
  let categoryupdateList: ICatUpdateList[] = [];

  const inputRef = useRef(null);
  const navigate = useNavigate();
  const storeDetails = useSelector(
    (state: HomestateProp) => state.masterReducer.storeDetails
  );
  const tokenExpired = useSelector(
    (state: HomestateProp) => state.masterReducer.tokenExpired
  );

  const { data: posMenu, refetch } = usegetCatalouge({
    store_id: storeDetails?.store_id,
  });

  useEffect(() => {
    if (tokenExpired) {
      navigate(ROUTES.FINDMASTER);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenExpired]);

  const onSearch = (value: string) => {
    const menuItems = document.querySelectorAll(
      '.searchableField'
    ) as NodeListOf<HTMLDivElement>;

    let hideCategories = new Set<string>();
    let showCategories = new Set<string>();

    let itemmatchFound = false;
    for (const item of menuItems) {
      const categoryId: string | null = item.getAttribute('data-catid');
      if (categoryId) {
        if (String(item.textContent).toLowerCase().includes(value)) {
          item.style.display = 'flex';
          showCategories.add(categoryId);
        } else {
          item.style.display = 'none';
          hideCategories.add(categoryId);
          itemmatchFound = true;
        }
      }
    }

    if (hideCategories.size) {
      for (const cattoHide of [...hideCategories]) {
        const foundCategory = document.getElementById(cattoHide);
        if (foundCategory) foundCategory.style.display = 'none';
      }

      for (const cattoHide of [...showCategories]) {
        const foundCategory = document.getElementById(cattoHide);
        if (foundCategory) foundCategory.style.display = 'flex';
      }
    } else {
      const menuItems = document.querySelectorAll(
        '.categoryTitles'
      ) as NodeListOf<HTMLDivElement>;
      for (const item of menuItems) {
        item.style.display = 'flex';
      }
    }
  };

  const renderStockview = () => {
    const viewElements: JSX.Element[] = [];
    if (posMenu && posMenu.data && posMenu.data.itemmapeedCategories) {
      let categoriesList = Object.values(posMenu.data.itemmapeedCategories);

      for (const iterator of categoriesList) {
        if (iterator && iterator.items && iterator.items.length) {
          const categoryTitle = (
            <div
              id={`category_${iterator.category_refid}`}
              className={`categoryTitles ${styles.categoryName}`}
            >
              <div> {iterator.category_name}</div>
              <Switch
                defaultChecked={iterator.is_active === 1}
                onClick={(checked: boolean) => {
                  categoryupdateList.push({
                    category_refid: iterator.category_refid,
                    is_active: checked ? 1 : 0,
                  });
                }}
              />
            </div>
          );
          const items = iterator.items.map((item) => (
            <div
              data-title={item.title}
              key={item.item_id}
              id={`stock_item_${item.item_id}`}
              data-catid={`category_${iterator.category_refid}`}
              className={`${styles.categoryitem} searchableField`}
            >
              <div className={`${styles.itemNamecontainer}`}>{item.title}</div>
              <Switch
                defaultChecked={item.active === 1}
                onClick={(checked: boolean) => {
                  itemupdateList.push({
                    item_refid: item.item_refid,
                    is_active: checked ? 1 : 0,
                  });
                }}
              />
            </div>
          ));
          viewElements.push(
            <div key={iterator.id} className={`${styles.categoryContainer}`}>
              {categoryTitle}
              <div className={`${styles.categoryitemsContainer}`}> {items}</div>
            </div>
          );
        }
      }
    }
    return viewElements;
  };

  const clearsearchInput = () => {
    const input = document.getElementById(
      'search_stock_items'
    ) as HTMLInputElement;
    if (input) input.value = '';
  };

  const sendUpdate = () => {
    if (
      (itemupdateList && itemupdateList.length) ||
      (categoryupdateList && categoryupdateList.length)
    ) {
      updateCatalouge({
        store_id: storeDetails.store_id,
        items: itemupdateList,
        categories: categoryupdateList,
      })
        .then((_data) => {
          itemupdateList = [];
          categoryupdateList = [];
          showNotification({
            message: `Request is queued`,
            icon: 'success',
          });
          clearsearchInput();
          onSearch('');
          refetch();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      refetch();
    }, 300);
    return () => {};
  }, []);

  useEffect(() => {
    return () => {};
  }, [posMenu]);

  const onsearchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onSearch(e.target.value);
  };

  const debouncedChangeHandler = useMemo(
    () => debounce(onsearchChange, 300),
    []
  );

  const refreshMenu = () => {
    clearsearchInput();
    onSearch('');
    refetch();
  };

  const goBack = () => {
    if (
      (itemupdateList && itemupdateList.length) ||
      (categoryupdateList && categoryupdateList.length)
    ) {
      Modal.confirm({
        title: 'Changes are not saved',
        content: 'Do you really want to go back?',
        onOk() {
          navigate(-1);
        },
        onCancel() {},
        cancelText: 'No',
        okText: 'Yes',
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <Layout className={`${styles.categoryWrapper}`}>
      <Header className={`${styles.header}`}>
        <Button
          className={`mr-2 iconButtons`}
          onClick={goBack}
          title="Open Settings"
          icon={<IoArrowBackCircleOutline size={35} />}
        />
        <Title level={3}>Stock Settings</Title>
      </Header>
      <Content className={`${styles.content}`}>
        <>
          <div className={`${styles.searchContainer}`}>
            <input
              id="search_stock_items"
              className={`tmbill-input ${styles.searchinput}`}
              placeholder="Search Item"
              onChange={debouncedChangeHandler}
              ref={inputRef}
            />

            <Button className={`ml-1`} onClick={refreshMenu} title="Refresh">
              Refresh
            </Button>
          </div>
          <Divider style={{ margin: '5px' }} />
          <div className={`${styles.actionsContainer}`}>
            <Button
              className={`ml-1`}
              onClick={sendUpdate}
              title="Save Changes"
            >
              Update
            </Button>
          </div>

          <div className={`${styles.categoryparentContainer}`}>
            {posMenu &&
              posMenu?.data &&
              posMenu.data.itemmapeedCategories &&
              renderStockview()}
          </div>
          {/* {isFetching && <MasterLoader />} */}
        </>
      </Content>
      {/* <Footer>Footer</Footer> */}
    </Layout>
  );
}

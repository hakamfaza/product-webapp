/* eslint-disable no-unused-expressions */
/* eslint-disable react/no-unstable-nested-components */
import React, {
  useState,
  useRef,
} from 'react';
import { SearchOutlined } from '@ant-design/icons';
import {
  Table, Button, Input, Space,
} from 'antd';
import Highlighter from 'react-highlight-words';

import product from '../database/product.json';

import Navbar from '../components/navbar/navbar';

export default function Home() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => record[dataIndex]
      .toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => (searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{
          backgroundColor: '#ffc069',
          padding: 0,
        }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    )),
  });

  // const filterBrand = product.reduce((acc, cur) => {
  //   if (acc.map((item) => item.brand).includes(cur.brand)) {
  //     const found = acc.find((entry) => entry.brand === cur.brand);
  //     found.brand.push(cur.brand);
  //     return acc;
  //   }
  //   // cur.brand = [cur.brand];
  //   // acc.push(cur);
  //   return acc;
  // }, []);

  // console.log(filterBrand);

  const getBrand = product.map((item) => ({
    text: item.brand,
    value: item.brand,
  }));

  const columns = [
    {
      title: 'Photo',
      dataIndex: 'thumbnail',
      width: '15%',
      render: (t, record) => (
        <div>
          <img src={record.thumbnail} alt="product" style={{ width: '130px', height: '100px', objectFit: 'cover' }} />
        </div>
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '30%',
      ...getColumnSearchProps('title'),
      sorter: (a, b) => a.title.length - b.title.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      width: '20%',
      filters: getBrand,
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.brand.includes(value),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      sortDirections: ['descend', 'ascend'],
      // width: '',
    },
  ];

  const data = product;

  return (
    <>
      <Navbar />
      <div style={{ padding: '100px 50px 50px 50px' }}>
        <Table dataSource={data} columns={columns} />
      </div>
    </>
  );
}
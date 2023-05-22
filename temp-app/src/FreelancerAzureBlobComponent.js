import React, { useEffect, useRef, useState } from 'react';
import { CloudDownloadOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Tabs } from 'antd';
import 'antd/dist/reset.css'

const initialItems = [
  {
    label: 'Tab 1',
    children: (
      <div style={{ padding: '5px 30px' }}>
        No files here.
      </div>
    ),
    key: '1',
    closable: false,
  },
  {
    label: 'Tab 2',
    children: 'Content of Tab 2',
    closable: false,
    key: '2',
  },
  {
    label: 'Tab 3',
    children: 'Content of Tab 3',
    key: '3',
    closable: false,
  },
];

const App = () => {
  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [items, setItems] = useState(initialItems);
  const newTabIndex = useRef(0);

  const [files, setFiles] = useState([])
  const elementRef = useRef();

  const onChange = (newActiveKey) => {
    setActiveKey(newActiveKey);
  };

  useEffect(() => {
    setItems([
      {
        label: 'Tab 1',
        children: (
          <div style={{ padding: '5px 30px' }}>
            {files.map(fi => <Item name={fi} />)}
          </div>
        ),
        key: '1',
        closable: false,
      },
      ...items.filter(it => it.key !== '1'),
    ])
  }, [items])

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      // File upload here

      // const data = new FormData();
      // files.forEach((file, i) => {
      //   data.append(`file-${i}`, file, file.name);
      // });

      // // 👇 Uploading the files using the fetch API to the server
      // fetch('https://httpbin.org/post', {
      //   method: 'POST',
      //   body: data,
      // })
      //   .then((res) => res.json())
      //   .then((data) => console.log(data))
      //   .catch((err) => console.error(err));

      if (!files.includes(e.target.files[0].name))
        setFiles([...files, e.target.files[0].name]);
    }
  };


  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: 'New Tab',
      children: 'Content of new Tab',
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };
  const remove = (targetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };
  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };
  return (
    <>
      <style type='text/css'>
        {`
          .box {
            border: 1px solid lightgray;
          }
        `}
      </style>

      <div style={{ display: 'flex', justifyContent: 'right' }}>
        <input ref={elementRef} type="file" style={{ display: 'none' }} onChange={handleFileChange} />
        <Button style={{ marginBottom: '5px' }} onClick={() => { elementRef.current.click() }}>
          Upload files
        </Button>
      </div>
      <div className='box'>
        <Tabs
          type="editable-card"
          onChange={onChange}
          activeKey={activeKey}
          onEdit={onEdit}
          items={items}
        />
      </div>
    </>
  );
};

function Item({ name }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
      <div>{name}</div>
      <div>
        <Button style={{ marginRight: '3px' }}>
          <CloudDownloadOutlined />
        </Button>
        <Button>
          <DeleteOutlined />
        </Button>
      </div>
    </div>
  )
}

export default App;
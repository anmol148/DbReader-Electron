import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Collapse, ListGroup, ListGroupItem } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const DataUpdated = () => {
  const [openPanel, setOpenPanel] = useState(null);
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [Reclistdata, setreclistdata] = useState([]);
  const handlePanelClick = (panelId) => {
    setOpenPanel(panelId === openPanel ? null : panelId);
  };
  
  const navigate = useNavigate();
  
  const sqlTypes = {
    TR: 'Trigger',
    SQ: 'Sequence',
    FN: 'Function',
    S: 'Smallint',
    D: 'Date',
    IT: 'Interval',
    SO: 'Serial',
    PK: 'Primary Key',
    P: 'Procedure',
    U: 'User-defined Type',
    UQ: 'Unique',
    V: 'View',
    IF: 'If Statement',
    TF: 'Table-Valued Function',
    FS: 'Filestream',
    FT: 'Full-Text',
    PC: 'Partition Column',
    C: 'Cursor'
  };
  const getSqlTypeValue = (key) => {
    console.log(typeof('U'));
    const v=key;
     if(v=='U'){
      console.log('yes');
    };
    console.log(v + sqlTypes[v]);
    return sqlTypes['TR'];
  };
  useEffect(() => {
    const onComponentLoad = () => {
      const param = { Queryid: '2' }
      window.electron.send('Dashboard-data', param);
      window.electron.receive('Dashboard-result', (e, args) => {
        e = JSON.parse(e);
        //console.log('data:', e);
        setData(e)
        const newData = { id:'', name: '' };
        setData(prevData => [...prevData, newData]);
      });
    };
    onComponentLoad();
  }, [])
  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };
  const handledropdownChange = (drpdown) => {
    setSelectedOption(drpdown);
  };
  const handleClick = () => {

    const params = {
      startdate: convertToDateTimeFormat(selectedStartDate),
      enddate: convertToDateTimeFormat(selectedEndDate, selectedTime),
      database: selectedOption ? selectedOption.label : '',
      Queryid: 3,
    };
    console.log(params);
    window.electron.send('Dashboard-data', params);
    window.electron.receive('RecList-result', (e, args) => {
      e = JSON.parse(e);
      console.log('data:', e);
      setreclistdata(e);


    });

  }
  const formattedOptions = data.map((item) => ({
    value: item.id,
    label: item.name
  }));
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 200,
      margin: '0 auto', // Adjust the width as needed
    })
  };
  const divStyle = {
    marginRight: '50px'
  };
  const convertToDateTimeFormat = (dt, tm = '') => {
    console.log(tm);
    const date = new Date(dt);
    if (tm !== '') {
      const Time = new Date(tm);

      const hours = Time.getUTCHours().toString().padStart(2, '0');
      const minutes = Time.getUTCMinutes().toString().padStart(2, '0');
      const seconds = Time.getUTCSeconds().toString().padStart(2, '0');
      const milliseconds = Time.getUTCMilliseconds().toString().padStart(3, '0');

      //const time = selectedTime.split();
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(seconds);
      date.setUTCMilliseconds(milliseconds);
    }


    return date.toISOString().substring(0, 23);

  }
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',

    },
    title: {
      marginRight: '10px',
    },

  };
  const groupedData = Reclistdata.reduce((acc, item) => {
    if (!acc[item.ObjectType]) {
      acc[item.ObjectType] = [];
    }
    acc[item.ObjectType].push(item);
    return acc;
  }, {});
  return (
    <>
      <button onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} /> Go Back
      </button>
      <div className="inline-select" style={styles.container}>
        <div className="inline-item" style={styles.title}>
          <h5>Select Start Date</h5>
          <DatePicker
            selected={selectedStartDate}
            onChange={handleStartDateChange}
            dateFormat="MM/dd/yyyy"
          />
        </div>

        <div className="inline-item" style={styles.title}>
          <h5>Select End Date</h5>
          <DatePicker
            selected={selectedEndDate}
            onChange={handleEndDateChange}
            dateFormat="MM/dd/yyyy"
          />
        </div>

        <div className="inline-item" style={styles.title}>
          <h5>Select Time</h5>
          <DatePicker
            selected={selectedTime}
            onChange={handleTimeChange}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            dateFormat="h:mm aa"
          />
        </div>

        {/* <div className="inline-item" style={styles.title}>
    <h5>DataBase</h5>
    <select>
      {data.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  </div> */}

        <div className="inline-item" style={styles.title}>
          <Select options={formattedOptions} className="my-dropdown" styles={customStyles} value={selectedOption} onChange={handledropdownChange} />
        </div>

        <div className="inline-item" style={styles.title}>
          <button className="search-button" onClick={handleClick}>
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>
      <div>
      {/* {Reclistdata && (
  <ListGroup>
    {Reclistdata.map((item, index) => (
      <div>
      <ListGroupItem
        key={index}
        onClick={() => handlePanelClick(index)}
        className={openPanel === index ? 'active' : ''}
      >
        {getSqlTypeValue(item.ObjectType)}
        {item.ObjectType}
        
      </ListGroupItem>
      <Collapse in={openPanel === index}>
            <div>
              {Reclistdata.map((item, index) => {
                return ((
                  <ListGroupItem key={index}>
                    <div>
                      <span>{item.DatabaseName}</span>
                      <span>Last Modified: {item.ObjectName}</span>
                    </div>
                  </ListGroupItem>
                ))
              }

              )}
            </div>

          </Collapse>
      </div>
    ))}

    {/* Add more panels as needed */}
 
 <ListGroup>
      {Object.entries(groupedData).map(([ObjectType, data],ind) => (
        <div key={ObjectType}>
          <ListGroupItem
            onClick={() => handlePanelClick(ind)}
            className={openPanel === ind ? 'active' : ''}
          >
           <span style={divStyle}>{ObjectType}</span>
           <span style={divStyle}>{data.length}</span> 
          </ListGroupItem>
        
            {data.map((item, index) => (
              <Collapse in={openPanel === ind}>
              <div>
                
                    <ListGroupItem key={index}>
                      <div>
                      <span style={divStyle}>{item.DatabaseName}</span>
                       <span style={divStyle}>{item.ObjectName}</span>
                       <span style={divStyle}>{item.CreateDate}</span>
                       <span style={divStyle}>{item.ModifyDate}</span>
                      </div>
                    </ListGroupItem>
                 
               
              </div>
  
              </Collapse>
            ))}
        
        </div>
      ))}
    </ListGroup>
      </div>
    </>

  );
};

export default DataUpdated;
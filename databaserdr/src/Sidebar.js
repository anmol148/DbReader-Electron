
import { useEffect,useState,React } from 'react';
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink, json } from 'react-router-dom';
const Sidebar = (props) => {
  const [data, setData] = useState([]);
 
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
useEffect(()=>{
  const param={Queryid:'1',}
    const onComponentLoad=()=>{ 
        window.electron.send('Dashboard-data',param);
        window.electron.receive('Dashboard-result',(e,args)=>{
         e = JSON.parse(e);
          //console.log('data:', e);
         setData(e)
         
       });};
       onComponentLoad();
},[])
useEffect(() => {
  console.log(data);
  console.log(Array.isArray(data));
  console.log(typeof(data));
  console.log('data.length',data.length); // This will log the updated value of data
}, [data]);
  const sum = data.reduce((accumulator, currentValue) => accumulator + currentValue.SpaceInMB, 0);
  const d = {
    labels: data.map((item) => item.DatabaseName),
  datasets: [
   {
    label: 'Data Consumption',
    data: data.map((item) => (item.SpaceInMB*100)/sum),
    backgroundColor: "rgba(255, 99, 132, 0.5)",
    hoverBackgroundColor: ['lightorange'],
   },
    ],
   };
   const options = {
    tooltips: {
      callbacks: {
        label: (tooltipItem, d) => {
          const dataIndex = tooltipItem.dataIndex;
          const valueInPercentage = d.datasets[0].d[dataIndex];
          const valueInMB = data[dataIndex].SpaceInMB;
          console.log('valueInMB',valueInMB);
          return `${valueInPercentage.toFixed(2)}% (Size: ${valueInMB} MB)`;
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
      },
    },
  };
  return (
    <>
    <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
            Sidebar
          </a>
        </CDBSidebarHeader>
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/DataUpdated" activeClassName="activeClicked" >
              <CDBSidebarMenuItem icon="columns">DataUpdated</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/tables" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="table">Tables</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/profile" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="user">Profile page</CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/analytics" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">Analytics</CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/hero404" target="_blank" activeClassName="activeClicked">
              <CDBSidebarMenuItem icon="exclamation-circle">404 page</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>

        <CDBSidebarFooter style={{ textAlign: 'center' }}>
          <div
            style={{
              padding: '20px 5px',
            }}
          >
            Sidebar Footer
          </div>
        </CDBSidebarFooter>
      </CDBSidebar>
    </div>
    <div style={{ flex: 1, padding: '20px' }}>
     <Bar
      data={d}
      options={options}
    />
    </div>
    
    
    {/* {data.length > 0 && (
        <div>
          {data.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </div>
      )} */}
    
    </>
  );
};

export default Sidebar;
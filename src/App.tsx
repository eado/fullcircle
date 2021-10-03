import React, { useEffect, useState } from 'react';
import { CalendarOutline, PeopleOutline, SettingsOutline } from 'react-ionicons';
import './App.css';
import Calendar from './Calendar';
import Home from './Home';
import Scheduler from './Scheduler';
import { getSelf } from './ServerProvider';
import Settings from './Settings';
import Signin from './Signin';

function App() {
  const [currentPage, scp] = useState("")
  const [currentSchedule, scs] = useState({} as any)

  const onSignin = (a: string) => {
    scp("home")
  }

  const onBack = () => {
    scp("home")
  }

  const onSchedule = (user: any) => {
    scs(user)
    scp("scheduler")
  }

  useEffect(() => {
    getSelf().then(() => {
      scp("home")
    }).catch(() => scp("signin"))
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        {(() => {
          switch (currentPage) {
            case "signin": return <Signin onSignin={onSignin} />
            case "home": return <Home onSchedule={onSchedule}/>
            case "schedule": return <Calendar />
            case "scheduler": return <Scheduler user={currentSchedule} times={[]} onBack={onBack} />
            case "settings": return <Settings />
          }
        })()}
        {(() => {
          if (['home', 'schedule', 'settings'].indexOf(currentPage) > -1) {
            return <ul className="footer">
            <li onClick={() => scp("home")}><PeopleOutline color={currentPage === "home" ? '#71cf6b' : '#ffffff'} height="4vmax" width="4vmax"/></li>
            <li onClick={() => scp("schedule")}><CalendarOutline color={currentPage === "schedule" ? '#71cf6b' : '#ffffff'} height="4vmax" width="4vmax"/></li>
            <li onClick={() => scp("settings")}><SettingsOutline color={currentPage === "settings" ? '#71cf6b' : '#ffffff'} height="4vmax" width="4vmax"/></li>
          </ul>
          }
        })()}
      </header>
    </div>
  );
}

export default App;

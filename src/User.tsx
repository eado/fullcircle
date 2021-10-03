
import { CalendarOutline } from 'react-ionicons'

const User: React.FC<{user: any, onSchedule: (user: any) => void}>= (props) => {
    if (window.location.hostname === "localhost" && (props.user.pfp as string).startsWith("/")) {
        props.user.pfp = "http://localhost:80" + props.user.pfp
    }
    return (
        <li className="mentor">
                
                <img src={props.user.pfp} alt={props.user.name}></img>
                <button onClick={() => props.onSchedule(props.user)}><CalendarOutline color={'#ffffff'} height="3vmax" width="3vmax" /></button>
                <h3>{props.user.name}</h3>
                <p><b>{props.user.type}</b></p>
                <p>{props.user.bio}</p>
        </li>
    )
}

export default User
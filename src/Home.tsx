import { useEffect, useState } from 'react'
import './Home.css'
import { getMentors } from './ServerProvider'
import User from './User'

const Home: React.FC<{onSchedule: (user: any) => void}> = (props) => {
    const [mentors, setMentors] = useState([] as any[])
    useEffect(() => {
        getMentors().then(setMentors)
    }, [])
    return (<>
        {mentors && mentors.length > 0 ? <>
            <h2>Mentors</h2>
            <ul className="mentorlist">
                {mentors.map((m, i) => <User key={i} onSchedule={props.onSchedule} user={m} />)}
            </ul>
        </> : <h3>No mentors found</h3>}
        
    </>)
}

export default Home
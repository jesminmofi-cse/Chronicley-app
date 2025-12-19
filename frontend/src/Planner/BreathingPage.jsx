import React, {useState, useEffect} from 'react';
import './BreathingPage.css';
const phases=[
    {name:'Inhale', duration:4000},
    {name:'Hold', duration:16000},
    {name:'Exhale', duration:8000},
];
const totalRounds=3;
const BreathingPage=()=>{
    const [round, setRound]=useState(1);
    const [phaseIndex, setPhaseIndex]=useState(0);
    const [timer, setTimer]=useState(phases[0].duration/1000);
    const [isRunning, setIsRunning]=useState(false);
    useEffect (()=>{
        let interval;
        if(isRunning && round <= totalRounds){
            interval=setInterval(()=>{
                setTimer((prev)=>{
                    if (prev===1){
                        const nextIndex=(phaseIndex+1) % phases.length;
                        if (nextIndex===0){
                            setRound((r)=>r+1);
                        }
                        setPhaseIndex(nextIndex);
                        return phases[nextIndex].duration/1000;
                    }
                    return prev-1;
                });
            },1000);
        }
        return ()=> clearInterval (interval);

    },[isRunning, phaseIndex, round]);
    const handleStart = () => {
  setIsRunning(true);
  setPhaseIndex(0);
  setRound(1);
  setTimer(phases[0].duration / 1000);
};

    const handleReset=()=>{
        setIsRunning(false);
        setRound(1);
        setPhaseIndex(0);
        setTimer(phases[0].duration/1000);
    };
    return(
        <div className='breathing-container'>
            <h2>Wim hoff Breathing</h2>
            <div className='video-container'>
                <iframe width='100%' height='315' src='https://www.youtube.com/embed/tybOi4hjZFQ' title='Wim Hof Breathing Guide' frameBorder='0' allow='accelerometer; autoplay;clipboard-write;encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen/>

            </div>
            {round > totalRounds ? (
                <div className='complete-msg'>Session Complete! Breathe easy.</div>
                  
            ):(
                <>
                <div className='round'>Round {round} of {totalRounds}</div>
                <div className='phase'>{phases[phaseIndex].name}</div>
                <div className='timer'>{timer}s</div>
                <div className={`breathing-circle ${phases[phaseIndex].name.toLowerCase()}`}/>
                </>
            )}
            <div className='controls'>
                {!isRunning && <button onClick={handleStart}>Start</button>}
                <button onClick={handleReset}>Reset</button>
            </div>
        </div>
    );
};
export default BreathingPage;
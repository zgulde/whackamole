import { useState, useEffect, useReducer } from 'react'
import swal from 'sweetalert'

const N_HOLES = 9

const getRandomInt = max => {
  return Math.floor(Math.random() * max);
}

const actions = {
  deactivate(index, wasClicked) {
    return {
      type: 'DEACTIVATE',
      payload: {index: index, score: wasClicked ? 1 : 0}
    }
  },
  lightRandom(dispatch) {
    const randomIndex = getRandomInt(N_HOLES)
    setTimeout(() => dispatch(actions.deactivate(randomIndex, false)), 1000)
    return {
      type: 'ACTIVATE', payload: {index: randomIndex}
    }
  },
  setPlaying(playing) {
    return {type: 'SET_PLAYING', payload: {playing}}
  },
  nextLevel() {
    return {type: 'NEXT_LEVEL'}
  }
}

const reducer = (state, action) => {
  switch(action.type) {
    case 'DEACTIVATE':
      return {
        ...state,
        holes: state.holes.map((e, i) => i === action.payload.index ? false : e),
        score: state.score + action.payload.score
      }
    case 'ACTIVATE':
      return {
        ...state,
        holes: state.holes.map((e, i) => i === action.payload.index ? true : e),
      }
    case 'SET_PLAYING':
      return {...state, playing: action.payload.playing}
    case 'NEXT_LEVEL':
      return {...state, level: state.level + 1}
    default:
      return state
  }
}
const initialState = {
  score: 0,
  level: 0,
  holes: [...Array(N_HOLES).keys()].map(() => false),
  playing: false,
}

const MoleHole = props => {
  const dispatch = props.dispatch
  const [timeoutId, setTimeoutId] = useState(null)
  useEffect(() => {
    if (! props.active) {
      return
    }
    setTimeoutId(setTimeout(
      () => dispatch(actions.deactivate(props.i, false)),
      1000,
    ))
  }, [])
  const style = {
    background: props.active ? 'red' : 'white',
    transition: 'background .15s',
    border: '1px solid black',
  }
  const onClick = () => {
    if (props.active) {
      dispatch(actions.deactivate(props.i, true))
      clearTimeout(timeoutId)
    }
  }
  return (
    <div className='hole' style={style} onClick={onClick} />
  )
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    if (state.level === 0) {
      return
    }
    swal('Get Ready...').then(() => {
      const intervalId = setInterval(() => {
        dispatch(actions.lightRandom(dispatch))
      }, 500)
      dispatch(actions.setPlaying(true))
      setTimeout(() => {
        dispatch(actions.setPlaying(false))
        clearInterval(intervalId)
        swal('Time\'s Up!')
      }, 10 * 1000)
    })
  }, [state.level])

  return (
    <main className='App'>
      <h1>Whack A Mole</h1>
      <div className='gameboard'>
        {state.holes.map((active, i) => (
          <MoleHole key={i} i={i} dispatch={dispatch} active={active} />
        ))}
      </div>
      <p className='display'>
        Score: {state.score} | Level: {state.level}
      </p>
      <button
        onClick={() => dispatch(actions.nextLevel())}
        disabled={state.playing}
        children='Next Level'/>
    </main>
  )
}

export default App;

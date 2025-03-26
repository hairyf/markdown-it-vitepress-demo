import React from 'react'

function Demo() {
  type Message = string | number
  const data: Message = 'Hello!'

  function print(text: Message) {
    alert(text)
  }

  return (
    <button onClick={() => print(data)}>
      {data}
      {' '}
      Click me!
    </button>
  )
}

export default Demo

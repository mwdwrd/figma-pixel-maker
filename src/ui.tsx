import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './ui.css'

declare function require(path: string): any

class App extends React.Component {
  onCreate = () => {
    parent.postMessage({
      pluginMessage: {
        type: 'chunkify'
      }
    }, '*')
  }

  render() {
    return <div>
      <h2>Select Image to Chunk</h2>
      <button id="create" onClick={this.onCreate}>Chunk</button>
    </div>
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'))

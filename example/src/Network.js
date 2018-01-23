import React from 'react'
import RenderProp from 'render-prop'

class NetworkModel extends RenderProp {
  state = {
    data: undefined,
    endpoint: 'https://swapi.co/api/people/1',
    loading: false,
    updateEndpoint: this.updateEndpoint.bind(this),
    refreshData: this.refreshData.bind(this)
  }
  didMount() {
    this.refreshData()
  }
  updateEndpoint(endpoint) {
    this.setState({endpoint})
  }
  async refreshData() {
    const endpoint = this.state.endpoint
    this.setState({loading: true})
    const response = await fetch(endpoint)
    const json = await response.json()
    this.setState({data: json, loading: false})
  }
}

class NetworkView extends React.Component {
  render() {
    const {data, endpoint, loading, updateEndpoint, refreshData} = this.props

    return (
      <div className="Network">
        <form
          onSubmit={e => {
            e.preventDefault()
            refreshData()
          }}
        >
          <label>
            <span>Endpoint:</span>
            <input
              name="endpoint"
              value={endpoint}
              onChange={e => updateEndpoint(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Refresh</button>
          {loading ? <span> Loading...</span> : null}
        </form>
        <br />
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    )
  }
}

const Network = () => (
  <NetworkModel
    render={({data, endpoint, loading, updateEndpoint, refreshData}) => (
      <NetworkView
        data={data}
        endpoint={endpoint}
        loading={loading}
        updateEndpoint={updateEndpoint}
        refreshData={refreshData}
      />
    )}
  />
)

export default Network

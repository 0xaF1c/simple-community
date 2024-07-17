
import { createBrowserHistory } from 'history'
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'

export function useHistory() {
  return {
    new() {
      return createBrowserHistory()
    }
  }
}

export {
  HistoryRouter
}
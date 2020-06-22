import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as cookie from 'cookie';
import * as setCookie from 'set-cookie-parser';

import http from '../store/actions/http';
import { fetchUser, refreshToken, login, logout } from '../store/actions/user';
import { wrapper } from '../store/store'
import { useState } from 'react';

const Index = ({ user, loginAction, logoutAction }) => {
  if (user) return (
    <div>
      <h1>User logged in: { user.username }</h1>
      <button onClick={() => logoutAction()}>
        Logout
      </button>
    </div>
  );

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div>
      <input 
        value={username}
        onChange={e => { setUsername(e.target.value); }}
      />
      <input
        type="password"
        value={password}
        onChange={e => { setPassword(e.target.value)}}
      />
      <button onClick={() => loginAction(username, password)}>
        Login
      </button>
    </div>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ req, res, store }) => {
  /**
   * If req is present this function is running on the server
   * The server at this point will _always_ be missing the accessToken because it is stored in the clients memory
   * for that reason we need to correctly set the axios instances cookie header and fetch refreshToken
   */
  if (req) {
    http.defaults.headers.cookie = req.headers.cookie || "";
    http.defaults.headers.Authorization = req.headers.Authorization || "";
    try {
      const resp = await http.get('/api/refresh');
      res.setHeader('set-cookie', resp.headers['set-cookie']);
      const respCookie = setCookie.parse(resp.headers['set-cookie'])[0];
      http.defaults.headers.cookie = cookie.serialize(respCookie.name, respCookie.value);
      http.defaults.headers.Authorization = `Bearer ${resp.data.accessToken}`;
    } catch (e) {
      console.error(e);
    }
  }
  
  await store.dispatch(fetchUser());
})

const mapStateToProps = (state) => {
  const { user } = state;
  return { user };
}

const mapDispatchToProps = (dispatch) => {
  return {
    loginAction: bindActionCreators(login, dispatch),
    logoutAction: bindActionCreators(logout, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)

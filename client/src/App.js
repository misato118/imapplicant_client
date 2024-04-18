import React from 'react';
import Container from '@mui/material/Container';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap in React

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Applications from './components/Applications/Applications';
import Scores from './components/Scores/Scores';
import Scores_result from './components/Scores/Scores_result';
import Research from './components/Research/Research';
import Auth from './components/Auth/Auth';
import Error from './components/Error/Error';
import Reset_Password from './components/Reset_Password/Reset_Password';

const App = () => (
  <BrowserRouter>
    <Container maxWidth='xl'>
      <Navbar />
      <Routes>
        <Route path='/' exact element={<Home />} />
        <Route path='/applications' exact element={<Applications />} />
        <Route path='/error' exact element={<Error />} />
        <Route path='/scores' exact element={<Scores />} />
        <Route path='/scores' exact element={<Scores_result />} />
        <Route path='/research' exact element={<Research />} />
        <Route path='/auth' exact element={<Auth />} />
        <Route path='/reset_password/:token' exact element={<Reset_Password />} />
      </Routes>
    </Container>
  </BrowserRouter>
)

export default App;

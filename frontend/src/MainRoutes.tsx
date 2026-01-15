import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RestaurantList from './pages/RestaurantList';

export default function MainRoutes(){
    return (
        <>
      <Router>
        <Routes>
          <Route path="/restaurants" element= {<RestaurantList />}/>
          <Route path="/" element={<Navigate to="/restaurants" replace />} />
        </Routes>
      </Router>
        </>
    )
}
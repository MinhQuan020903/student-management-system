import { combineReducers } from 'redux';
import cart from './cart/cart';
import favorite from './favorite/favorite';
import notification from './notification/notification';

export default combineReducers({ cart, favorite, notification });

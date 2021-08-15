import React from 'react';
import { shallow, mount } from 'enzyme';
import App from './App';
import toJson from 'enzyme-to-json';
import Header from './components/header/Header';

it('renders without crashing', () => {
  shallow(<App />);
});

// it('renders correctly with no error message', () => {
//   const wrapper = mount();
//   expect(wrapper.state('error')).toEqual(null);
// });

// describe('', () => {
//   it('accepts user account props', () => {
//     const wrapper = mount(<Account user={user} />);
//     expect(wrapper.props().user).toEqual(user);
//   });
//   it('contains users account email', () => {
//     const wrapper = mount(<Account user={user} />);
//     const value = wrapper.find('p').text();
//     expect(value).toEqual('david@gmail.com');
//   });
// });

it('renders correctly', () => {
  const tree = shallow(<App />);
  expect(toJson(tree)).toMatchSnapshot();
});

it('renders Header component', () => {
  const wrapper = shallow(<App />);
  const header = <Header />;
  expect(wrapper.contains(header)).toEqual(true);
});

import React from 'react';
import { shallow } from 'enzyme';
import App from "./App";

describe('<App />', () => {
  it('should have a header called \'Welcome to React SSR Starter\'', () => {
    const wrapper = shallow(<App/>);
    const actual = wrapper.find('h1').text();
    const expected = 'Welcome to React SSR Starter';

    expect(actual).toEqual(expected);
  });
});

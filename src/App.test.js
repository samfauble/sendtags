import React from 'react';
import Enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { empty } from "./testData"
import SendTags from './SendTags'

Enzyme.configure({ adapter: new Adapter() });

/*
test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/

describe("onChange handler", () => {
  test("add new change to tags attribute", () => {})
  test("add new change to config attribute", () => {
  })
  test("add new change to sendTo attribute", () => {})
  test("add new change to sendType attribute", () => {})
  test("persist pre-existing state on new change", () => {})
})

describe("onSubmit handler", ()=> {
  test("no data", () => {
    const wrapper = shallow(<SendTags />)

    wrapper.find('form').simulate('submit')

    expect(wrapper.instance().handleSubmit()).toThrow(new Error())
  })
  test("one config pair, no matches", () => {})
  test("one config pair, one match", () => {})
  test("two config pairs, no matches", () => {})
  test("two config pairs, one match", () => {})
  test("two config pairs, two matches", () => {})
})

import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

describe("onChange handler", () => {
  test("add new change to tags attribute", () => {})
  test("add new change to config attribute", () => {})
  test("add new change to sendTo attribute", () => {})
  test("add new change to sendType attribute", () => {})
  test("persist pre-existing state on new change", () => {})
})

describe("onSubmit handler", ()=> {
  test("one config pair, no matches", () => {})
  test("one config pair, one match", () => {})
  test("two config pairs, no matches", () => {})
  test("two config pairs, one matche", () => {})
  test("two config pairs, two matches", () => {})
})

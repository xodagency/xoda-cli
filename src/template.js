const component = {
  path: ({ compage, cate, name, jsext, styleext }) =>
    `src/${compage.lower}/${cate}${name.pascal}/${name.pascal}.${jsext}`,
  content: ({ compage, cate, name, jsext, styleext }) => `
import React from "react";
import PropTypes from "prop-types";
import "./${name.pascal}.${styleext}";
import styled from "styled-components";

const ${name.pascal}Wrapper = styled.div\`\`;

const ${name.pascal} = ({children, ...props}${
    jsext.startsWith('ts') ? ': {children:any}' : ''
  })=>(<${name.pascal}Wrapper {...props}>{children}</${name.pascal}Wrapper>);

${name.pascal}.propTypes = {};

${name.pascal}.defaultProps = {};

export default ${name.pascal};`,
};
const stylesheet = {
  path: ({ compage, cate, name, jsext, styleext }) =>
    `src/${compage.lower}/${cate}${name.pascal}/${name.pascal}.${styleext}`,
  content: ({ compage, cate, name, jsext, styleext }) => `.${name.pascal} {}`,
};
const lazy = {
  path: ({ compage, cate, name, jsext, styleext }) =>
    `src/${compage.lower}/${cate}${name.pascal}/${name.pascal}.lazy.${jsext}`,
  content: ({ compage, cate, name, jsext, styleext }) => `
import React, { lazy, Suspense } from 'react';

const Lazy${name.pascal} = lazy(() => import('./${name.pascal}'));

const ${name.pascal} = ${jsext.startsWith('ts') ? '(props:any)' : 'props'} => (
  <Suspense fallback={null}>
    <Lazy${name.pascal} {...props} />
  </Suspense>
);

export default ${name.pascal};`,
};
const story = {
  path: ({ compage, cate, name, jsext, styleext }) =>
    `src/${compage.lower}/${cate}${name.pascal}/${name.pascal}.stories.${jsext}`,
  content: ({ compage, cate, name, jsext, styleext }) => `
/* eslint-disable */
import React from "react";
import { storiesOf } from "@storybook/react";
import ${name.pascal} from "./${name.pascal}";

storiesOf("${compage.pascal}/${cate}${name.pascal}", module).add("default", () => (
  <${name.pascal}>${name.pascal} ${compage.pascal}</${name.pascal}>
));`,
};
const test = {
  path: ({ compage, cate, name, jsext, styleext }) =>
    `src/${compage.lower}/${cate}${name.pascal}/${name.pascal}.test.${jsext}`,
  content: ({ compage, cate, name, jsext, styleext }) => `
import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ${name.pascal} from './${name.pascal}';

describe('<${name.pascal} />', () => {
  afterEach(cleanup);

  test('it should mount', () => {
    const { getByTestId } = render(<${name.pascal} />);
    const ${name.camel} = getByTestId('${name.pascal}');

    expect(${name.camel}).toBeInTheDocument();
  });
});
`,
};
module.exports = { component, stylesheet, lazy, story, test };

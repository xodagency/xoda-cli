const component = {
  path: ({ basedir, compage, cate, name, jsext, styleext, is: { js, ts, jsx, tsx } }) =>
    `${basedir}/${compage.lower}/${cate}${name.pascal}/${name.pascal}.${jsext}`,
  content: ({ compage, cate, name, jsext, styleext, is: { js, ts, jsx, tsx } }) => `
import React${!ts ? '' : `, { FunctionComponent, PropsWithChildren }`} from "react";
${!js ? '' : `import PropTypes from "prop-types";
`}import styled from "styled-components";
${styleext ? `import "./${name.pascal}.${styleext}";` : ""}
${!ts ? '' : `
interface ${name.pascal}Props extends PropsWithChildren<any> {
  
}
`}
const ${name.pascal}Wrapper = styled.div${!ts ? '' : `<${name.pascal}Props>`}\`\`;

const ${name.pascal}${!ts ? '' : `: FunctionComponent<${name.pascal}Props>`} = ({children, ...props})=>(
  <${name.pascal}Wrapper {...props}>{children}</${name.pascal}Wrapper>
);
${!js ? '' : `
${name.pascal}.propTypes = {};

${name.pascal}.defaultProps = {};
`}
export default ${name.pascal};`,
};
const stylesheet = {
  path: ({ basedir, compage, cate, name, jsext, styleext }) =>
    `${basedir}/${compage.lower}/${cate}${name.pascal}/${name.pascal}.${styleext}`,
  content: ({ compage, cate, name, jsext, styleext }) => `.${name.pascal} {}`,
};
const lazy = {
  path: ({ basedir, compage, cate, name, jsext, styleext }) =>
    `${basedir}/${compage.lower}/${cate}${name.pascal}/${name.pascal}.lazy.${jsext}`,
  content: ({ compage, cate, name, jsext, styleext, is: { js, ts, jsx, tsx } }) => `
import React, { lazy, Suspense } from 'react';

const Lazy${name.pascal} = lazy(() => import('./${name.pascal}'));

const ${name.pascal} = ${ts ? '(props?:any)' : 'props'} => (
  <Suspense fallback={null}>
    <Lazy${name.pascal} {...props} />
  </Suspense>
);

export default ${name.pascal};`,
};
const story = {
  path: ({ basedir, compage, cate, name, jsext, styleext }) =>
    `${basedir}/${compage.lower}/${cate}${name.pascal}/${name.pascal}.stories.${jsext}`,
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
  path: ({ basedir, compage, cate, name, jsext, styleext, is: { js, ts, jsx, tsx } }) =>
    `${basedir}/${compage.lower}/${cate}${name.pascal}/${name.pascal}.test.${jsext}`,
  content: ({ compage, cate, name, jsext, styleext, is: { js, ts, jsx, tsx } }) => `
import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ${name.pascal} from './${name.pascal}';

describe('<${name.pascal} />', () => {
  afterEach(cleanup);

  test('it should mount', () => {
    const { getByTestId } = render(<${name.pascal} />);

    expect(container.firstChild).not.toBeNull();
  });
});
`,
};
module.exports = { component, stylesheet, lazy, story, test };

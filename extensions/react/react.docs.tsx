import React from 'react';
import { ThemeContext } from '@teambit/documenter.theme.theme-context';
import { LinkedHeading } from '@teambit/documenter.ui.linked-heading';
import { Section } from '@teambit/documenter.ui.section';
import { Paragraph } from '@teambit/documenter.ui.paragraph';
import { List } from '@teambit/documenter.ui.list';
import { Separator } from '@teambit/documenter.ui.separator';
import { HighlightedText } from '@teambit/documenter.ui.highlighted-text';
import { PropTable } from '@teambit/documenter.ui.property-table';
import { CodeSnippet } from '@teambit/documenter.ui.code-snippet';

import ReactJson from 'react-json-view';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.scss';

import { workspaceEx, workspaceProps, extensionDirStructure, customReactExt, exportExtension } from './code-snippets';

export const abstract = 'An environment for React components';

export default () => {
  return (
    <ThemeContext>
      <>
        <Section>
          <LinkedHeading link="introduction">Introduction</LinkedHeading>
          <Paragraph>
            The React aspect (environment) "ties together" various aspects that relate to the lifecycle of a React
            component in a Bit workspace. It spares you the overhead of setting up your own environment and creates a
            standardized environment for your team.
          </Paragraph>
          <br />
          <Paragraph>
            The React aspect can be <a href="#ws-config">configured via the workspace.json</a>. It can also be used to{' '}
            <a href="#extending">create a custom environment extension</a> that tailors to your own needs.
          </Paragraph>
          <Separator />
        </Section>
        <Section>
          <LinkedHeading link="ws-config">Workspace Configuration</LinkedHeading>
          <Paragraph>The React aspect can be configured via the workspace.json, on two levels:</Paragraph>
          <List element="ol" style={{ marginBottom: '15px' }}>
            {[
              <>
                <HighlightedText>root</HighlightedText> sets the default confugirations for the entire workspace
              </>,
              <>
                <HighlightedText>teambit.bit/variants</HighlightedText> sets the configurations to a limited set of
                components, selected by their common directory
              </>,
            ]}
          </List>
          <Tabs style={{ marginBottom: '15px' }}>
            <TabList>
              <Tab>root</Tab>
              <Tab>variants</Tab>
            </TabList>
            <TabPanel>
              <PropTable rows={workspaceProps} />
            </TabPanel>
            <TabPanel>
              <PropTable rows={workspaceProps} />
            </TabPanel>
          </Tabs>
          <LinkedHeading link="example-ws-config" size="xs">
            Example
          </LinkedHeading>
          <ReactJson
            src={workspaceEx}
            theme="monokai"
            collapsed={false}
            style={{ borderRadius: '5px', padding: '15px' }}
          />
          <Separator />
        </Section>
        <Section>
          <LinkedHeading link="extending">Creating a Custom React Environment</LinkedHeading>
          <Paragraph>
            You can use your own customized React environment by creating an extension component and setting your
            workspace to use it (using its component ID).
          </Paragraph>
          <LinkedHeading link="example-extending" size="xs">
            Example
          </LinkedHeading>
          <Paragraph>We'll start by creating the nessecary files for an extension component.</Paragraph>
          <CodeSnippet>{extensionDirStructure}</CodeSnippet>
          <Paragraph>We'll then add the necessary boilerplate for a React extension</Paragraph>
          <Tabs style={{ marginBottom: '15px' }}>
            <TabList>
              <Tab>custom-react</Tab>
              <Tab>index</Tab>
            </TabList>
            <TabPanel>
              <CodeSnippet>{customReactExt}</CodeSnippet>
            </TabPanel>
            <TabPanel>
              <CodeSnippet>{exportExtension}</CodeSnippet>
            </TabPanel>
          </Tabs>
          <LinkedHeading link="available-overrides">Available Override Functions</LinkedHeading>
          <LinkedHeading link="override-ts-config" size="x-sm">
            overrideTsConfig
          </LinkedHeading>
          <LinkedHeading link="override-dev-server-config" size="x-sm">
            overrideDevServerConfig
          </LinkedHeading>
          <LinkedHeading link="override-preview-config" size="x-sm">
            overridePreviewConfig
          </LinkedHeading>
          <LinkedHeading link="override-jest-config" size="x-sm">
            overrideJestConfig
          </LinkedHeading>
          <LinkedHeading link="override-build-pipe" size="x-sm">
            overrideBuildPipe
          </LinkedHeading>
          <LinkedHeading link="override-dependencies" size="x-sm">
            override-dependencies
          </LinkedHeading>
          <LinkedHeading link="override-package-json-props" size="x-sm">
            overridePackageJsonProps
          </LinkedHeading>
          <Separator />
        </Section>
      </>
    </ThemeContext>
  );
};

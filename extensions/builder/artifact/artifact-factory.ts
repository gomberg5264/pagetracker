import { join } from 'path';
import globby from 'globby';
import { flatten } from 'lodash';
import { Component, ComponentMap } from '@teambit/component';
import type { StorageResolverSlot } from '../builder.main.runtime';
import { ArtifactDefinition } from './artifact-definition';
import { DefaultResolver, StorageResolver } from '../storage';
import { ArtifactList } from './artifact-list';
import { Artifact } from './artifact';
import type { BuildContext, BuildTask } from '../build-task';
import { CapsuleNotFound } from '../exceptions';

export const DEFAULT_CONTEXT = 'component';

export type ArtifactMap = ComponentMap<ArtifactList>;

export class ArtifactFactory {
  constructor(private storageResolverSlot: StorageResolverSlot) {}

  private getResolver(resolvers: StorageResolver[], name?: string) {
    const defaultResolver = new DefaultResolver();
    const userResolver = resolvers.find((resolver) => resolver.name === name);
    return userResolver || defaultResolver;
  }

  private resolvePaths(root: string, def: ArtifactDefinition): string[] {
    const patternsFlattened = flatten(def.globPatterns);
    const paths = globby.sync(patternsFlattened, { cwd: root });
    return paths;
  }

  private getArtifactContextPath(context: BuildContext, component: Component, def: ArtifactDefinition) {
    const artifactContext = this.getArtifactContext(def);
    if (artifactContext === 'component') {
      const capsulePath = context.capsuleGraph.capsules.getCapsule(component.id)?.path;
      if (!capsulePath) throw new CapsuleNotFound(component.id);
      return capsulePath;
    }

    return context.capsuleGraph.capsulesRootDir;
  }

  private getArtifactContext(def: ArtifactDefinition) {
    return def.context || DEFAULT_CONTEXT;
  }

  createFromComponent(context: BuildContext, component: Component, def: ArtifactDefinition, task: BuildTask) {
    const storageResolver = this.getStorageResolver(def);
    const rootDir = this.getArtifactContextPath(context, component, def);
    const paths = this.resolvePaths(this.getRootDir(rootDir, def), def);

    return new Artifact(def, storageResolver, paths, rootDir, task);
  }

  private getStorageResolver(def: ArtifactDefinition) {
    const storageResolvers = this.storageResolverSlot.values();
    return this.getResolver(storageResolvers, def.storageResolver);
  }

  private toComponentMap(context: BuildContext, artifactMap: [string, Artifact][]) {
    return ComponentMap.as<ArtifactList>(context.components, (component) => {
      const id = component.id.toString();
      const artifacts = artifactMap.filter(([targetId]) => targetId === id).map(([, artifact]) => artifact);

      return new ArtifactList(artifacts);
    });
  }

  private getRootDir(rootDir: string, def: ArtifactDefinition) {
    if (!def.rootDir) return rootDir;
    return join(rootDir, def.rootDir);
  }

  /**
   * generate artifacts from a build context according to the spec defined in the artifact definitions.
   */
  generate(context: BuildContext, defs: ArtifactDefinition[], task: BuildTask): ComponentMap<ArtifactList> {
    const tupleArr: [string, Artifact][] = [];

    defs.forEach((def) => {
      const artifactContext = this.getArtifactContext(def);
      if (artifactContext === 'env') {
        const capsuleDir = context.capsuleGraph.capsulesRootDir;
        const rootDir = this.getRootDir(capsuleDir, def);

        const artifact = new Artifact(
          def,
          this.getStorageResolver(def),
          this.resolvePaths(rootDir, def),
          rootDir,
          task
        );

        return context.components.forEach((component) => {
          tupleArr.push([component.id.toString(), artifact]);
        });
      }

      return context.components.forEach((component) => {
        const artifact = this.createFromComponent(context, component, def, task);
        tupleArr.push([component.id.toString(), artifact]);
      });
    });

    return this.toComponentMap(context, tupleArr);
  }
}

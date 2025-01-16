import { describe, it, expect } from 'vitest';
import LWSHostHelpers from './LWSHost';
const { sessionStore, isWebId, isSparqlEndpoint } = LWSHostHelpers;
import LWSProcessHelpers from './LWSProcess';
const { extractProcessNamefromPodURL, extractTaskNamefromPodURL, extractApplicationPathFromTaskURI } = LWSProcessHelpers

describe('LWSHost', () => {
  describe('extractProcessNamefromPodURL', () => {
    it('should extract process name correctly if a task is given', () => {
      const processURI = new URL('https://storage.inrupt.com/ea779a2c-b43d-4723-8b1a-aaa8990dd576/process/Organisation/add');
      const processContainer = new URL('https://storage.inrupt.com/ea779a2c-b43d-4723-8b1a-aaa8990dd576/process/');
      const result = extractProcessNamefromPodURL(processURI, processContainer, false);
      expect(result).toBe('Organisation');
    });

    it('should extract process name [URI fragment] correctly if a task is given', () => {
      const processURI = new URL('https://storage.inrupt.com/ea779a2c-b43d-4723-8b1a-aaa8990dd576/process/Organisation/add');
      const processContainer = new URL('https://storage.inrupt.com/ea779a2c-b43d-4723-8b1a-aaa8990dd576/process/');
      const result = extractProcessNamefromPodURL(processURI, processContainer, true);
      expect(result).toBe('Organisation/');
    });

    it('should extract process name correctly if no Task is given', () => {
      const processURI = new URL('https://storage.inrupt.com/ea779a2c-b43d-4723-8b1a-aaa8990dd576/process/Organisation/');
      const processContainer = new URL('https://storage.inrupt.com/ea779a2c-b43d-4723-8b1a-aaa8990dd576/process/');
      const result = extractProcessNamefromPodURL(processURI, processContainer, false);
      expect(result).toBe('Organisation');
    });

    it('should not extract process name if the URI is not a container', () => {
      const processURI = new URL('https://storage.inrupt.com/ea779a2c-b43d-4723-8b1a-aaa8990dd576/process/badProcess');
      const processContainer = new URL('https://storage.inrupt.com/ea779a2c-b43d-4723-8b1a-aaa8990dd576/process/');
      const result = extractProcessNamefromPodURL(processURI, processContainer, false);
      expect(result).toBeNull();
    });

    it('should not extract process name [URI fragment] if the URI is not a container', () => {
      const processURI = new URL('https://storage.inrupt.com/ea779a2c-b43d-4723-8b1a-aaa8990dd576/process/badProcess');
      const processContainer = new URL('https://storage.inrupt.com/ea779a2c-b43d-4723-8b1a-aaa8990dd576/process/');
      const result = extractProcessNamefromPodURL(processURI, processContainer, true);
      expect(result).toBeNull();
    });

    it('should return null if processURI is null', () => {
      const result = extractProcessNamefromPodURL(undefined, new URL('https://storage.inrupt.com/ea779a2c-b43d-4723-8b1a-aaa8990dd576/process/'), false);
      expect(result).toBeNull();
    });

    it('should return null if processContainer is null', () => {
      const result = extractProcessNamefromPodURL(new URL('https://storage.inrupt.com/ea779a2c-b43d-4723-8b1a-aaa8990dd576/process/Organisation/add'), undefined, false);
      expect(result).toBeNull();
    });
  });

  describe('extractTaskNamefromPodURL', () => {
    it('should extract task name correctly', () => {
      const taskURI = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/TheThirdProcess/SecondTask');
      const processContainer = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/');
      const result = extractTaskNamefromPodURL(taskURI, processContainer, false);
      expect(result).toBe('SecondTask');
    });

    it('should extract task name as a fragment correctly', () => {
      const taskURI = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/TheThirdProcess/SecondTask');
      const processContainer = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/');
      const result = extractTaskNamefromPodURL(taskURI, processContainer, true);
      expect(result).toBe('SecondTask/');
    });

    it('should extract task name correctly when a step is added', () => {
      const taskURI = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/TheThirdProcess/SecondTask#StepNr');
      const processContainer = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/');
      const result = extractTaskNamefromPodURL(taskURI, processContainer, false);
      expect(result).toBe('SecondTask');
    });

    it('should extract task name correctly when a step is added', () => {
      const taskURI = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/TheThirdProcess/SecondTask#StepNr');
      const processContainer = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/');
      const result = extractTaskNamefromPodURL(taskURI, processContainer, true);
      expect(result).toBe('SecondTask/');
    });

    it('should return null if taskURI is null', () => {
      const result = extractTaskNamefromPodURL(undefined, new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/'), false);
      expect(result).toBeNull();
    });

    it('should return null if processContainer is null', () => {
      const result = extractTaskNamefromPodURL(new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/TheThirdProcess/SecondTask'), undefined, false);
      expect(result).toBeNull();
    });
  });

  describe('extractApplicationPathFromTaskURI', () => {
    it('should extract application path correctly without step', () => {
      const taskURI = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/TheThirdProcess/SecondTask');
      const processContainer = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/');
      const result = extractApplicationPathFromTaskURI(taskURI, processContainer, '', false);
      expect(result).toBe('TheThirdProcess/SecondTask');
    });

    it('should extract application path correctly with a empty step', () => {
      const taskURI = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/TheThirdProcess/SecondTask#');
      const processContainer = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/');
      const result = extractApplicationPathFromTaskURI(taskURI, processContainer, '', false);
      expect(result).toBe('TheThirdProcess/SecondTask');
    });

    it('should not extract application path if the Task is a Container with a Step resource and not a resource itself', () => {
      const taskURI = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/TheThirdProcess/SecondTask/Step');
      const processContainer = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/');
      const result = extractApplicationPathFromTaskURI(taskURI, processContainer, '', false);
      expect(result).toBeNull();
    });

    it('should not extract application path if the Task is a Container and not a resource', () => {
      const taskURI = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/TheThirdProcess/SecondTask/');
      const processContainer = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/');
      const result = extractApplicationPathFromTaskURI(taskURI, processContainer, '', false);
      expect(result).toBeNull();
    });

    it('should extract Solid Pod path correctly with step', () => {
      const taskURI = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/TheThirdProcess/SecondTask#stepNumber');
      const processContainer = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/');
      const result = extractApplicationPathFromTaskURI(taskURI, processContainer, 'stepNumber', false);
      expect(result).toBe('TheThirdProcess/SecondTask#stepNumber');
    });

    it('should extract application path correctly with step', () => {
      const taskURI = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/TheThirdProcess/SecondTask#stepNumber');
      const processContainer = new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/');
      const result = extractApplicationPathFromTaskURI(taskURI, processContainer, 'stepNumber', true);
      expect(result).toBe('TheThirdProcess/SecondTask/stepNumber');
    });

    it('should return null if taskURI is null', () => {
      const result = extractApplicationPathFromTaskURI(undefined, new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/'), '', false);
      expect(result).toBeNull();
    });

    it('should return null if processContainer is null', () => {
      const result = extractApplicationPathFromTaskURI(new URL('https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/process/TheThirdProcess/SecondTask'), undefined, '', false);
      expect(result).toBeNull();
    });
  });

  describe('isWebId', () => {
    it('should return true for a valid WebId', async () => {
      const webIdURI = new URL('https://id.inrupt.com/certiman');
      const result = await isWebId(webIdURI);
      expect(result).toBe(true);
    });

    it('should return false for an invalid WebId', async () => {
      const webIdURI = new URL('https://www.inrupt.com/about');
      const result = await isWebId(webIdURI);
      expect(result).toBe(false);
    });
  });

  describe('isSparqlEndpoint', () => {
    // local ones
    const validLocalEndpoint = 'http://va-inspector.era.europa.eu:3030/ERALEX/sparql';

    // https://demo.openlinksw.com/sparql, , 'https://dbpedia.org/sparql', https://fragments.dbpedia.org/2015/en
    const validEndpoint = 'https://demo.openlinksw.com/sparql';
    const invalidEndpoint = 'https://demo.openlinksw.com/query';

    // TESTs
    it('should return true for a valid SPARQL endpoint', async () => {
      const sparqlEndpointURI = new URL(validEndpoint);
      const result = await isSparqlEndpoint(sparqlEndpointURI);
      expect(result).toBe(true);
    });

    it('should return true for a valid local SPARQL endpoint', async () => {
      const sparqlEndpointURI = new URL(validLocalEndpoint);
      const result = await isSparqlEndpoint(sparqlEndpointURI);
      expect(result).toBe(true);
    });

    it('should return false for an invalid SPARQL endpoint', async () => {
      const sparqlEndpointURI = new URL(invalidEndpoint); // not an endpoint, even 404
      const result = await isSparqlEndpoint(sparqlEndpointURI);
      expect(result).toBe(false);
    });
  });

  describe('sessionStore.ownStoragePodRoot', () => {
    it('should return the root URL of the storage pod', () => {
      sessionStore.selectedPodURL = 'https://storage.inrupt.com/b5186a91-fffe-422a-bf6a-02a61f470541/';
      const result = sessionStore.ownStoragePodRoot();
      expect(result).toBe('https://storage.inrupt.com');
    });

    it('should return null if selectedPodURL is empty', () => {
      sessionStore.selectedPodURL = '';
      const result = sessionStore.ownStoragePodRoot();
      expect(result).toBeNull();
    });

    it('should return null if selectedPodURL is undefined', () => {
      sessionStore.selectedPodURL = undefined;
      const result = sessionStore.ownStoragePodRoot();
      expect(result).toBeNull();
    });
  });
});
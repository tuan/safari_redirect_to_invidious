import React from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import { ChangeEvent } from 'react';
import { FormEvent } from 'react';
import invidiousConfigStorage from '@root/src/shared/storages/invidiousConfigStorage';
import useStorage from '@root/src/shared/hooks/useStorage';

const DEFAULT_INVIDIOUS_INSTANCE = 'https://yewtu.be';
const Options: React.FC = () => {
  const { autoRedirectEnabled } = useStorage(invidiousConfigStorage);
  const [host, setHost] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getHost() {
      const host = await invidiousConfigStorage.getHost();
      setHost(host);
    }

    getHost();
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  function handleHostChange({ target }: ChangeEvent<HTMLInputElement>) {
    setHost(target.value);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    invidiousConfigStorage.set({
      host,
      autoRedirectEnabled,
    });
    window.close();
  }

  return (
    <div className="w-full h-screen max-h-[50vh] flex items-center justify-center mb-20">
      <form onSubmit={handleSubmit} className="flex flex-col w-96 p-2">
        <div className="flex items-center justify-between">
          <label htmlFor="hostInput" className="text-sm font-medium leading-6 text-gray-900 mt-2">
            Use a{' '}
            <a className="text-blue-600" href="https://docs.invidious.io/instances/" target="_blank">
              public Invidious instance
            </a>{' '}
            or provide your own:
          </label>
          <input
            ref={inputRef}
            type="text"
            className="border bg-transparent py-1.5 pl-1 
                    text-gray-900 placeholder:text-gray-400 
                    focus:ring-0 sm:text-sm sm:leading-6"
            placeholder={DEFAULT_INVIDIOUS_INSTANCE}
            name="hostInput"
            id="hostInput"
            value={host}
            onChange={handleHostChange}
            onFocus={({ target }) => target.select()}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="auto-redirect-enabled">Auto-redirect to Invidious</label>
          <input
            type="checkbox"
            name="auto-redirect-enabled"
            id="auto-redirect-enabled"
            className="mr-4 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            checked={autoRedirectEnabled}
            onChange={() => invidiousConfigStorage.toggleAutoRedirect()}
          />
        </div>
        <input
          type="submit"
          title="Submit"
          className="rounded-md bg-indigo-600 px-3 py-2 mt-5 
                      text-sm font-semibold text-white 
                      shadow-sm hover:bg-indigo-500 
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
      </form>
    </div>
  );
};

export default Options;

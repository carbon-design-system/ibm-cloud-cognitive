import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { pkg } from '../../settings';
const componentName = 'APIKeyDownloader';

export const APIKeyDownloader = ({ apiKey, bodyText, fileName, linkText }) => {
  const [linkProps, setLinkProps] = useState('');

  useEffect(() => {
    const generateLinkProps = async () => {
      const data = { apiKey };
      const json = JSON.stringify(data);
      const blob = new Blob([json], { type: 'application/json' });
      const href = await URL.createObjectURL(blob);
      const download = `${fileName || 'apikey'}.json`;
      const props = {
        href,
        download,
      };
      setLinkProps(props);
    };

    generateLinkProps();
  }, [apiKey, fileName]);

  return (
    <p className={`${pkg.prefix}--apikey-modal__messaging-text`}>
      {bodyText} <a {...linkProps}>{linkText}</a>
    </p>
  );
};

APIKeyDownloader.displayName = componentName;
APIKeyDownloader.propTypes = {
  /**
   * the api key the user recieves
   */
  apiKey: PropTypes.string,
  /**
   * main component text
   */
  bodyText: PropTypes.string,
  /**
   * optional name for the file being generated
   */
  fileName: PropTypes.string,
  /**
   * text for the anchor tag
   */
  linkText: PropTypes.string,
};
APIKeyDownloader.defaultProps = {};

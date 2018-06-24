import React from 'react';
import * as Redux from 'redux';
import { connect } from 'react-redux';
import { AnyAction } from "redux";

interface SharingPanelProps {
    isLoadedFromOldStyleSharingLink: boolean;
}
     
class SharingPanelComponent extends React.Component<SharingPanelProps, {}> {
    
    // show alert is loaded from old style sharing link  data-bind="visible: loadedFromOldSharingLink"
    //icon-facebook2: data-bind="click: facebookShareList" 
    //icon-file-text2: data-bind="click: copyListToClipboard" 
    //icon-link: data-bind="click: shortenUrl, visible: showLinkSharing" 
    //show shortened URL when available: data-bind="visible: hasShortenedUrl"
    //show shortened URL value in text area data-bind="value: shortenedUrl" 
    // copy shortened URL to clipboard  data-bind="click: copyUrlToClipboard"
    render() {
        return  <div>
                    <h4>Share to...</h4>
                    { 
                    this.props.isLoadedFromOldStyleSharingLink 
                        ? <div className="alert alert-warning">
                            <p>This list was loaded from an <em>old style shared link</em>. <strong>Set the faction and ensure you have no mercenaries</strong> before you share.</p>
                            <p>If you don't, <strong>it won't load properly</strong> when you share it.</p>
                        </div>
                        : null
                    }
                    <div className="sharing-panel">
                        <a href="#" className="link-icon" title="Share to Facebook"><span className="icon-facebook2"></span></a>
                        <a href="#" className="link-icon" title="Copy list to clipboard"><span className="icon-file-text2"></span></a>
                        <a href="#" className="link-icon" title="Get link to list"><span className="icon-link"></span></a>
                        <span>
                            <textarea id="ShortenedUrlTextArea" rows={1}></textarea>
                            <a href="#" className="link-icon" title="Copy link to clipboard"><span className="icon-copy"></span></a>
                        </span>
                    </div>
                </div>;
    }
}

const mapStateToProps = (state: SharingPanelProps) => {
    return {
        isLoadedFromOldStyleSharingLink: false
    };
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<AnyAction>) => {
    return {
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SharingPanelComponent);


/*

*/
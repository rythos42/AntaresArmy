import React from 'react';
import FactionSelector from "./FactionSelector/FactionSelector";
import HelpModal from "./HelpModal";

export default class AppHeader extends React.Component {
    render() {
        return  <div className="header row">
                    <div className="col-6">
                        <h3>Antares</h3>
                    </div>
                    <div className="actions col-6">
                        <FactionSelector />
                        <a href="#" className="link-icon" data-toggle="modal" data-target="#HelpModal"><span className="icon-question"></span></a>
                        <HelpModal />
                    </div>
                </div>;
    }
}
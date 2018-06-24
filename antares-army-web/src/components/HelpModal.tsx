import React from 'react';

export default class HelpModal extends React.Component {
    render() {
        return  <div className="modal fade" id="HelpModal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <p><strong>Designed and developed by Craig Fleming</strong></p>
                                <p><a href="mailto:rythos42@gmail.com">rythos42 at gmail dot com</a></p>
                                <p>Quickly tinker with army lists, using data that has been automatically pulled from the <a href="https://store.warlordgames.com/collections/rules-books/digital+beyond-the-gates-of-antares">Warlord Games free army list PDFs</a>. No other purpose is intended, in particular there is no check that your list is valid!</p>
                                <p>This is <strong>not</strong> an officially supported <a href="https://store.warlordgames.com/">Warlord Games</a> app, no permission has been asked for or given.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>
    }
}
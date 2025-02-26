import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Pagination = ({
    page,
    totalPages,
    handlePreviousPage,
    handleNextPage,
    handleDirectPageChange,
}) => {
    const getDynamicPageNumbers = (currentPage, totalPageCount) => {
        const maxPageButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPageCount, startPage + maxPageButtons - 1);
        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }
        return [...Array(endPage - startPage + 1).keys()].map(i => startPage + i);
    };

    return (
        <div>
             { totalPages > 0 && (
            <div style={{ marginTop: '10px', marginRight: '1%', marginLeft: '1%', textAlign: "end", backgroundColor: 'white', padding: '7px' }}>

                <>
                    <button className="previous" onClick={handlePreviousPage} disabled={page === 1}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    {getDynamicPageNumbers(page, totalPages).map((pageNumber) => (
                        <div style={{ display: 'inline-block', marginLeft: '20px' }} key={pageNumber}>
                            <button
                                style={{ margin: '0 5px', border: 'none', backgroundColor: 'transparent' }}
                                onClick={() => handleDirectPageChange(pageNumber)}
                                className={pageNumber === page ? 'activePage' : ''}
                            >
                                {pageNumber}
                            </button>
                        </div>
                    ))}
                    <span>Page:</span>
                    <select value={page} onChange={(e) => handleDirectPageChange(parseInt(e.target.value))}>
                        {[...Array(totalPages).keys()].map((pageNumber) => (
                            <option key={pageNumber + 1} value={pageNumber + 1}>
                                {pageNumber + 1}
                            </option>
                        ))}
                    </select>
                    <span>of {totalPages}</span>
                    <button className="next" onClick={handleNextPage} disabled={page === totalPages}>
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </>

            </div>
        )}

        </div>
        
    );
};

export default Pagination;

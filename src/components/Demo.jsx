import React, { useState, useEffect } from 'react';
import { useLazyGetSummaryQuery } from '../services/article';

import { copy, linkIcon, loader, tick } from '../assets';

const Demo = () =>
{

    const [article, setArticle] = useState({
        url: '',
        summary: '',
    });

    const [allArticles, setAllArticles] = useState([]);

    const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

    useEffect(() =>
    {
        const articlesFromLocalStorage = JSON.parse(
            localStorage.getItem('articles')
        );

        if (articlesFromLocalStorage) {
            setAllArticles(articlesFromLocalStorage);
        }
    });

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        const { data } = await getSummary({ articleUrl: article.url });

        if (data?.summary) {
            const newArticle = { ...article, summary: data.summary };

            const updateAllArticles = [newArticle, ...allArticles];

            setArticle(newArticle);
            setAllArticles(updateAllArticles);

            localStorage.setItem("articles", JSON.stringify(updateAllArticles));
        }
    };

    return (
        <section className='mt-16 w-full max-w-xl'>
            <div className="flex flex-col w-full gap-2">
                <form className='relative flex justify-center 
                items-center'
                    onSubmit={handleSubmit}>
                    <img src={linkIcon} alt="link-icon"
                        className='absolute left-0 my-2 ml-3 w-5'
                    />
                    <input
                        type="url"
                        placeholder='Paste the link to summarize'
                        value={article.url}
                        onChange={(e) => setArticle({
                            ...article, url: e.target.value
                        })}
                        required
                        className='url_input peer'
                    />
                    <button type="submit" className='submit_btn peer-focus:border-gray-600 peer-focus:text-gray-600'>
                        <p>Send</p>
                    </button>
                </form>
                <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
                    {allArticles.reverse().map((item, index) => (
                        <div
                            key={`link-${index}`}
                            onClick={() => setArticle(item)}
                            className="link_card"
                        >
                            <div className="copy_btn">
                                <img
                                    src={copy}
                                    alt="copy-icon"
                                    className='w-[40%] h-[40%] object-contain'
                                />
                            </div>
                            <p className='flex-1 font-satoshi
                                text-blue-600 font-medium
                                text-sm truncate'
                            >
                                {item.url}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="my-10 max-w-full flex justify-center items-center">
                {isFetching ? (
                    <img src={loader} alt="loading" className='w-20 h-20 object-contain' />
                ) : error ? (
                    <p className='font-inter font-bold text-black text-center'>
                        It is an error message, please reload the page.
                        <br />
                        <span className='font-satoshi font-normal text-gray-600'>
                            {error?.data?.error}
                        </span>
                    </p>
                ) : (
                    article.summary && (
                        <div className="flex flex-col gap-3">
                            <h3 className="font-satoshi font-bold text-gray-600 text-xl">
                                Article Summary
                            </h3>
                            <div className="summary_box">
                                <p className='font-inter font-medium text-sm text-gray-600'>
                                    {article.summary}
                                </p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </section>
    );
};

export default Demo;
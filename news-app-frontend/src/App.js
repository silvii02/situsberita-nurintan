import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import logo from './logo.svg';
import Login from './components/auth/Login';
import Passwordreset from './components/auth/Passwordreset';
import About from './page/About';
import Header from './components/Header';
import Slider from './components/Slider';
import Footer from './components/Footer';
import Search from './components/Search';
import CategoryDropdown from './components/CategoryDropdown';
import ArticleList from './components/ArticleList';
import ArticleDetail from './page/ArticleDetail';
import Contact from './page/Contact';
import CategoryArticles from './components/CategoryArticles';
import CreateArticle from './page/CreateArticle';
import PopularArticleList from './components/PopularArticles';
import PopularArticleList1 from './components/PopularArticles1';
import TerkiniArticle from './components/TerkiniArticles';
import SidebarDashboard from './components/SidebarDashboard';
import Dashboard from './dashboard/dashboard';
import IndexDashboard from './dashboard/index';
import EditArticle from './dashboard/edit-article';
import PrivateRoute from './components/auth/PrivateRoute';
import ArtikelBawah from './components/googleTrend';
import SearchResults from '../src/page/SearchResults';
import PedomanMedia from '../src/page/PedomanMedia';
import TopTags from './components/TopTagsArtikel';
import TagArticlesPage from '../src/page/TagArticlesPage';
import TermsOfUse from '../src/page/TermsOfUse';
import Help from '../src/page/Help';
import PrivacyPolicy from '../src/page/PrivacyPolicy';
import TopTagsLink from './components/TopTagsLink';
import Categories from './components/Categories';
import ShareButtons from './components/ShareButtons';
import UserDropdown from './components/UserDropdown';
import CommentsReport from './components/CommentsReport';
import GoogleLoginButton from './components/GoogleLoginButton';
import './App.css';

function Home() {
  return (
    <div className="App">
      <div>
        < Header />
        < Slider />
        <div className="article-page-wrapper">
          <div className="article-content">
            <ArticleList />
          </div>
          <aside className="sidebar1">
            <TopTags />
            <TopTagsLink />
          </aside>
        </div>
        < PopularArticleList1 />
        < ArtikelBawah />
        < Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
     <div className="App" >
        <Routes>
          <Route path="/header" element={<Header />} />
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Passwordreset" element={<Passwordreset />} />
          <Route path="/about" element={<About />} />
          <Route path="/artikellist" element={<ArticleList />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/kategori/:slug" element={<CategoryArticles />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/categorydropdown" element={<CategoryDropdown />} />
          <Route path="/search" element={<Search />} />
          <Route path="/search-results" element={<SearchResults />} />
          <Route path="/populararticlelist" element={<PopularArticleList />} />
          <Route path="/populararticlelist1" element={<PopularArticleList1 />} />
          <Route path="/terkiniarticle" element={<TerkiniArticle />} />
          <Route path="/articles/:id/:slug" element={<ArticleDetail />} />
          <Route path="/tags/:tagId" element={<TagArticlesPage />} />
          <Route path="/pedomanmedia" element={<PedomanMedia />} />   
          <Route path="/termsofuse" element={<TermsOfUse />} />     
          <Route path="/help" element={<Help />} />    
          <Route path="/privacypolicy" element={<PrivacyPolicy />} /> 
          <Route path="/indexdashboard" element={<IndexDashboard />} /> 
          <Route path="/sidebardashboard" element={<SidebarDashboard />} /> 
          <Route path="/kategori" element={<Categories />} /> 
          <Route path="/sharebuttons" element={<ShareButtons />} /> 
          <Route path="/CommentsReport" element={<CommentsReport />} />
          <Route path="/UserDropdown" element={<UserDropdown />} /> 

        <Route element={<PrivateRoute />}>
        { <Route path="/create-article" element={<CreateArticle />} /> }
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-article/:id" element={<EditArticle />} />
        
        </Route>
        </Routes>
      </div>
  </Router>
  )
}

export default App;

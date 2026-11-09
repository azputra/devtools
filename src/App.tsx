import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tools from './pages/Tools'
import RegexTester from './tools/RegexTester'
import EpochConverter from './tools/EpochConverter'
import JsonFormatter from './tools/JsonFormatter'
import TextEscape from './tools/TextEscape'
import JsonPathTester from './tools/JsonPathTester'
import CsvJsonConverter from './tools/CsvJsonConverter'
import UrlQueryBuilder from './tools/UrlQueryBuilder'
import HttpHeaderInspector from './tools/HttpHeaderInspector'
import ApiRequestBuilder from './tools/ApiRequestBuilder'
import Base64Tool from './tools/Base64Tool'
import JwtInspector from './tools/JwtInspector'
import HashGenerator from './tools/HashGenerator'
import UuidGenerator from './tools/UuidGenerator'
import ColorConverter from './tools/ColorConverter'
import ColorPicker from './tools/ColorPicker'
import TextDiff from './tools/TextDiff'
import CaseConverter from './tools/CaseConverter'
import FixtureGenerator from './tools/FixtureGenerator'
import InvoiceGenerator from './tools/InvoiceGenerator'
import CronParser from './tools/CronParser'
import SqlFormatter from './tools/SqlFormatter'
import MarkdownPreview from './tools/MarkdownPreview'
import HttpStatusLookup from './tools/HttpStatusLookup'
import MimeLookup from './tools/MimeLookup'
import PermissionsCalculator from './tools/PermissionsCalculator'
import ImageUtility from './tools/ImageUtility'
import ScreenshotFramer from './tools/ScreenshotFramer'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="tools" element={<Tools />} />
          <Route path="tools/regex" element={<RegexTester />} />
          <Route path="tools/epoch" element={<EpochConverter />} />
          <Route path="tools/json-formatter" element={<JsonFormatter />} />
          <Route path="tools/text-escape" element={<TextEscape />} />
          <Route path="tools/jsonpath" element={<JsonPathTester />} />
          <Route path="tools/csv-json" element={<CsvJsonConverter />} />
          <Route path="tools/url-builder" element={<UrlQueryBuilder />} />
          <Route path="tools/http-headers" element={<HttpHeaderInspector />} />
          <Route path="tools/api-request" element={<ApiRequestBuilder />} />
          <Route path="tools/base64" element={<Base64Tool />} />
          <Route path="tools/jwt" element={<JwtInspector />} />
          <Route path="tools/hash" element={<HashGenerator />} />
          <Route path="tools/uuid" element={<UuidGenerator />} />
          <Route path="tools/color-converter" element={<ColorConverter />} />
          <Route path="tools/color-picker" element={<ColorPicker />} />
          <Route path="tools/text-diff" element={<TextDiff />} />
          <Route path="tools/case-converter" element={<CaseConverter />} />
          <Route path="tools/fixture" element={<FixtureGenerator />} />
          <Route path="tools/invoice" element={<InvoiceGenerator />} />
          <Route path="tools/cron" element={<CronParser />} />
          <Route path="tools/sql" element={<SqlFormatter />} />
          <Route path="tools/markdown" element={<MarkdownPreview />} />
          <Route path="tools/http-status" element={<HttpStatusLookup />} />
          <Route path="tools/mime" element={<MimeLookup />} />
          <Route path="tools/permissions" element={<PermissionsCalculator />} />
          <Route path="tools/image" element={<ImageUtility />} />
          <Route path="tools/screenshot-framer" element={<ScreenshotFramer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

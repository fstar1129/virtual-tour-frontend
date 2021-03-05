import Vue from 'vue';
import Child from './Child';
import Button from './Button';
import Spinner from './Spinner';
import InputHelp from './InputHelp';
import Alert from './Alert';
import BusyButton from './BusyButton';
import ConfirmModal from './ConfirmModal';
import CopyModal from './CopyModal';
import TourCard from './TourCard';
import StopCard from './StopCard';
import ImageBox from './ImageBox';
import CustomAudioPlayer from './CustomAudioPlayer';
import YoutubeInput from './YoutubeInput';
import StopChoice from './StopChoice';
import AddressForm from './AddressForm';
import GoogleAddressSearch from './GoogleAddressSearch';
import NextStopDropdown from './NextStopDropdown';
import FacebookLogin from './FacebookLogin';
import GoogleLogin from './GoogleLogin';
import DatePicker from './DatePicker';
import LineChart from './LineChart';
import DonutChart from './DonutChart';
import ChangePasswordModal from './admin/ChangePasswordModal';
import ChangePlanModal from './admin/ChangePlanModal';
import PricePlan from './PricePlan'

// Components that are registered globaly.
[
    Child,
    Button,
    Spinner,
    InputHelp,
    Alert,
    BusyButton,
    ConfirmModal,
    CopyModal,
    TourCard,
    StopCard,
    ImageBox,
    CustomAudioPlayer,
    YoutubeInput,
    StopChoice,
    AddressForm,
    GoogleAddressSearch,
    NextStopDropdown,
    FacebookLogin,
    GoogleLogin,
    DatePicker,
    LineChart,
    DonutChart,
    ChangePasswordModal,
    ChangePlanModal,
    PricePlan,
].forEach(Component => {
    Vue.component(Component.name, Component)
})

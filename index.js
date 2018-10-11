import {
  Animated,
  NativeModules,
  Platform,
  requireNativeComponent,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import React from 'react';

const {SajjadBlurOverlay}  = NativeModules;
const iface                = {name: 'BlurView'};
const RCTSajjadBlurOverlay = Platform.select({
  ios: () => requireNativeComponent('SajjadBlurOverlay', iface),
  android: () => requireNativeComponent('RCTSajjadBlurOverlay', iface),
})();

export default class BlurOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacityValue: new Animated.Value(0),
    }
  }

  componentDidMount() {
    this.processComponentVisibility();
  }

  componentDidUpdate() {
    this.processComponentVisibility();
  }

  processComponentVisibility = () => {
    this.props.isVisible ? this.showOverlay() : this.hideOverlay();
  };

  showOverlay = () => {
    if (this.props.isAnimated) {
      Animated.timing(
        this.state.opacityValue,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }
      ).start()
    } else {
      this.state.opacityValue.setValue(1);
    }
  };

  hideOverlay = () => {
    if (this.props.isAnimated) {
      Animated.timing(
        this.state.opacityValue,
        {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        }
      ).start();
    } else {
      this.state.opacityValue.setValue(0);
    }
  };

  render() {
    const {children} = this.props;

    return (
      <Animated.View style={[styles.style, {opacity: this.state.opacityValue}]}>
        <TouchableWithoutFeedback style={styles.style} onPress={this.props.onPress}>
          <RCTSajjadBlurOverlay {...this.props} style={[styles.style, this.props.customStyles]}>
            <View style={[styles.style, this.props.customStyles]}>
              {children}
            </View>
          </RCTSajjadBlurOverlay>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

BlurOverlay.defaultProps = {
  isVisible: true,
  isAnimated: true,
  customStyles: {}
};

const styles = StyleSheet.create({
  style: {
    position: 'absolute',
    flex: 1,
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    width: null,
    height: null,
    zIndex: 1,
  },
});

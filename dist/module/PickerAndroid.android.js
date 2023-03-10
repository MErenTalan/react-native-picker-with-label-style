/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */
'use strict';

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import * as React from 'react';
import { findNodeHandle, NativeSyntheticEvent, processColor, UIManager } from 'react-native';
import AndroidDialogPickerNativeComponent from './AndroidDialogPickerNativeComponent';
import AndroidDropdownPickerNativeComponent from './AndroidDropdownPickerNativeComponent';
const MODE_DROPDOWN = 'dropdown';

/**
 * Not exposed as a public API - use <Picker> instead.
 */
function PickerAndroid(props, ref) {
  const pickerRef = React.useRef(null);
  React.useImperativeHandle(ref, () => {
    const viewManagerConfig = UIManager.getViewManagerConfig(props.mode === MODE_DROPDOWN ? 'RNCAndroidDialogPicker' : 'RNCAndroidDropdownPicker');
    return {
      blur: () => {
        if (!viewManagerConfig.Commands) {
          return;
        }

        UIManager.dispatchViewManagerCommand(findNodeHandle(pickerRef.current), viewManagerConfig.Commands.blur, []);
      },
      focus: () => {
        if (!viewManagerConfig.Commands) {
          return;
        }

        UIManager.dispatchViewManagerCommand(findNodeHandle(pickerRef.current), viewManagerConfig.Commands.focus, []);
      }
    };
  });
  const [items, selected] = React.useMemo(() => {
    // eslint-disable-next-line no-shadow
    let selected = 0; // eslint-disable-next-line no-shadow

    const items = React.Children.toArray(props.children).map((child, index) => {
      if (child === null) {
        return null;
      }

      if (child.props.value === props.selectedValue) {
        selected = index;
      }

      const {
        enabled = true
      } = child.props;
      const {
        color,
        label,
        style = {}
      } = child.props;
      const processedColor = processColor(color);
      return {
        color: color == null ? null : processedColor,
        label,
        enabled,
        style: { ...style,
          color: style.color ? processColor(style.color) : null,
          backgroundColor: style.backgroundColor ? processColor(style.backgroundColor) : null
        }
      };
    });
    return [items, selected];
  }, [props.children, props.selectedValue]);
  const onSelect = React.useCallback(({
    nativeEvent
  }) => {
    const {
      position
    } = nativeEvent;
    const onValueChange = props.onValueChange;

    if (onValueChange != null) {
      if (position >= 0) {
        const children = React.Children.toArray(props.children).filter(item => item != null);
        const value = children[position].props.value;

        if (props.selectedValue !== value) {
          onValueChange(value, position);
        }
      } else {
        onValueChange(null, position);
      }
    } // The picker is a controlled component. This means we expect the
    // on*Change handlers to be in charge of updating our
    // `selectedValue` prop. That way they can also
    // disallow/undo/mutate the selection of certain values. In other
    // words, the embedder of this component should be the source of
    // truth, not the native component.


    if (pickerRef.current && selected !== position) {
      // TODO: using setNativeProps is deprecated and will be unsupported once Fabric lands. Use codegen to generate native commands
      pickerRef.current.setNativeProps({
        selected
      });
    }
  }, [props.children, props.onValueChange, props.selectedValue, selected]);
  const Picker = props.mode === MODE_DROPDOWN ? AndroidDropdownPickerNativeComponent : AndroidDialogPickerNativeComponent;
  const rootProps = {
    accessibilityLabel: props.accessibilityLabel,
    enabled: props.enabled,
    items,
    onBlur: props.onBlur,
    onFocus: props.onFocus,
    onSelect,
    prompt: props.prompt,
    selected,
    style: props.style,
    dropdownIconColor: processColor(props.dropdownIconColor),
    dropdownIconRippleColor: processColor(props.dropdownIconRippleColor),
    testID: props.testID,
    numberOfLines: props.numberOfLines
  };
  return /*#__PURE__*/React.createElement(Picker, _extends({
    ref: pickerRef
  }, rootProps));
}

export default /*#__PURE__*/React.forwardRef(PickerAndroid);
//# sourceMappingURL=PickerAndroid.android.js.map
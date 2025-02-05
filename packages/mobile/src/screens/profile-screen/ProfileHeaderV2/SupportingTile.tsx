import { useCallback } from 'react'

import type { Supporting } from '@audius/common'
import { WidthSizes } from '@audius/common'
import { getUser } from 'audius-client/src/common/store/cache/users/selectors'
import { TIPPING_TOP_RANK_THRESHOLD } from 'audius-client/src/utils/constants'
import { profilePage } from 'audius-client/src/utils/route'
import type { StyleProp, ViewStyle } from 'react-native'
import { ImageBackground, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import IconTrophy from 'app/assets/images/iconTrophy.svg'
import { Text, Tile } from 'app/components/core'
import { ProfilePicture } from 'app/components/user'
import UserBadges from 'app/components/user-badges'
import { useNavigation } from 'app/hooks/useNavigation'
import { useSelectorWeb } from 'app/hooks/useSelectorWeb'
import { useUserCoverPhoto } from 'app/hooks/useUserCoverPhoto'
import { makeStyles } from 'app/styles'
import { spacing } from 'app/styles/spacing'
import { useThemeColors } from 'app/utils/theme'

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    marginTop: spacing(2),
    paddingBottom: spacing(1),
    marginHorizontal: spacing(1),
    borderRadius: 8,
    overflow: 'hidden'
  },
  backgroundImage: {
    borderRadius: 8,
    overflow: 'hidden'
  },
  gradient: {
    minWidth: 220,
    height: 88,
    justifyContent: 'space-between',
    padding: spacing(2)
  },
  supportingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    margin: spacing(1)
  },
  profilePicture: {
    height: spacing(8),
    width: spacing(8),
    marginEnd: spacing(1),
    borderWidth: 1,
    borderColor: palette.staticWhite
  },
  rank: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: spacing(0.5),
    paddingHorizontal: spacing(1.125),
    borderWidth: 1,
    borderColor: palette.staticNeutralLight8,
    borderRadius: spacing(4),
    backgroundColor: palette.staticWhite
  },
  rankNumberSymbol: {
    marginStart: spacing(1),
    marginEnd: spacing(0.5)
  },
  rankText: {
    textTransform: 'uppercase',
    marginTop: spacing(-1),
    marginBottom: spacing(-1)
  },
  nameText: {
    color: palette.staticWhite,
    flexShrink: 1
  }
}))

type SupportingTileProps = {
  supporting: Supporting
  style?: StyleProp<ViewStyle>
  scaleTo?: number
}

export const SupportingTile = (props: SupportingTileProps) => {
  const { supporting, style, scaleTo } = props
  const styles = useStyles()
  const navigation = useNavigation()
  const { secondary } = useThemeColors()
  const user = useSelectorWeb((state) => {
    return getUser(state, { id: supporting.receiver_id })
  })
  const { user_id, handle, name, _cover_photo_sizes } = user || {}
  const isTopRank =
    supporting.rank >= 1 && supporting.rank <= TIPPING_TOP_RANK_THRESHOLD

  const coverPhoto = useUserCoverPhoto({
    id: user_id,
    sizes: _cover_photo_sizes ?? null,
    size: WidthSizes.SIZE_640
  })
  const isDefaultImage = coverPhoto && /imageCoverPhotoBlank/.test(coverPhoto)

  const handlePress = useCallback(() => {
    if (handle) {
      navigation.push({
        native: { screen: 'Profile', params: { handle } },
        web: { route: profilePage(handle) }
      })
    }
  }, [navigation, handle])

  const iconProps = {
    height: spacing(3.75),
    width: spacing(3.75)
  }

  return user ? (
    <Tile style={[styles.root, style]} onPress={handlePress} scaleTo={scaleTo}>
      <ImageBackground
        style={styles.backgroundImage}
        source={{
          uri: isDefaultImage ? `https://audius.co/${coverPhoto}` : coverPhoto
        }}>
        <LinearGradient
          colors={['#0000001A', '#0000004D']}
          useAngle
          angle={180}
          angleCenter={{ x: 0.5, y: 0.5 }}
          style={styles.gradient}>
          {isTopRank ? (
            <View style={styles.rank}>
              <IconTrophy fill={secondary} {...iconProps} />
              <Text
                style={styles.rankNumberSymbol}
                variant='label'
                color='secondary'
                fontSize='small'>
                #
              </Text>
              <Text
                style={styles.rankText}
                variant='label'
                color='secondary'
                fontSize='large'>
                {supporting.rank}
              </Text>
            </View>
          ) : null}
          <View style={styles.supportingInfo}>
            <ProfilePicture style={styles.profilePicture} profile={user} />
            <Text
              style={styles.nameText}
              variant='h3'
              noGutter
              numberOfLines={1}>
              {name}
            </Text>
            <UserBadges user={user} hideName />
          </View>
        </LinearGradient>
      </ImageBackground>
    </Tile>
  ) : null
}

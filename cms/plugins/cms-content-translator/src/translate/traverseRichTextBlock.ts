// TODO: move the implementation of the traverseRichTextBlock function to the application code and add an option to provide it via the plugin config.
//       Alternatively, it could be possible to get the field config for the block type and traverse the fields of the block like in the traverseFields function.

import { traverseRichText } from './traverseRichText'

interface TwoColumnRichTextProps {
  firstColumn: {
    root: {
      type: string
      children: {
        type: string
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  }
  secondColumn: {
    root: {
      type: string
      children: {
        type: string
        version: number
        [k: string]: unknown
      }[]
      direction: ('ltr' | 'rtl') | null
      format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
      indent: number
      version: number
    }
    [k: string]: unknown
  }
  /**
   * Displays the second column above the first on mobile devices. Useful for alternating layouts.
   */
  reverseOrderOnMobile?: boolean | null
  id?: string | null
  blockName?: string | null
  blockType: 'TwoColumnRichText'
}

interface CmsHotelListSectionProps {
  title?: string | null
  //items: (Hotel)[];
  showMoreButton?: boolean | null
  id?: string | null
  blockName?: string | null
  blockType: 'cmsHotelListSection'
}

interface CmsRoundTripsListSectionProps {
  title?: string | null
  //items?: (string | RoundTrip)[] | null;
  showMoreButton?: boolean | null
  id?: string | null
  blockName?: string | null
  blockType: 'cmsRoundTripsListSection'
}

/**
 * This function encapsulates the logic for identifying translatable fields within a given lexical block.
 *
 * It must be implemented in the application code rather than the plugin, as these blocks cannot
 * be traversed generically without the block configuration, which provides details on the localization
 * status of each field.
 */
export const traverseRichTextBlock = ({
  onText,
  root,
  siblingData,
}: {
  onText: (siblingData: Record<string, unknown>, key: string) => void
  root: Record<string, unknown>
  siblingData: Record<string, unknown>
}) => {
  if (
    'fields' in siblingData &&
    siblingData.fields &&
    typeof siblingData.fields === 'object' &&
    'blockType' in siblingData.fields
  ) {
    const blockData = siblingData.fields

    switch (blockData.blockType) {
      case 'TwoColumnRichText':
        const twoColumnRichText = blockData as TwoColumnRichTextProps

        traverseRichText({
          onText,
          root,
          siblingData: twoColumnRichText.firstColumn.root,
        })

        traverseRichText({
          onText,
          root,
          siblingData: twoColumnRichText.secondColumn.root,
        })
        break
      case 'cmsHotelListSection':
        const cmsHotelListSection = blockData as CmsHotelListSectionProps

        if (cmsHotelListSection.title) {
          onText(cmsHotelListSection as unknown as Record<string, unknown>, 'title')
        }

        break
      case 'cmsRoundTripsListSection':
        const cmsRoundTripsListSection = blockData as CmsRoundTripsListSectionProps

        if (cmsRoundTripsListSection.title) {
          onText(cmsRoundTripsListSection as unknown as Record<string, unknown>, 'title')
        }

        break
    }
  }
}
